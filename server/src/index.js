import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; // Import jwt
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import conversationRoutes from './routes/conversations.js';
import chatRoutes from './routes/chats.js';
import userRoutes from './routes/users.js';
import Message from './models/Message.js'; // Import Message model
import bookingRequestRoutes from './routes/bookingRequests.js';
import reviewRoutes from './routes/reviews.js';
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['https://nexathon-flame.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Export io instance
export { io };

// CORS should be one of the first middleware
app.use(cors({
  origin: ['https://nexathon-flame.vercel.app', 'http://localhost:5173'], // Allow both production and development origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allow all necessary HTTP methods
  credentials: true, // Allow credentials
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  exposedHeaders: ['Content-Range', 'X-Content-Range'], // If you need to expose any headers
}));

// Then other middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/booking-requests', bookingRequestRoutes);
app.use('/api/reviews', reviewRoutes);

// Initialize global users map
global.users = new Map();

// Socket.IO handling
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication token required'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded._id;
        socket.username = decoded.name;
        next();
    } catch (err) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Add user to active users
    global.users.set(socket.userId, socket.id);

    // Handle new conversation notification
    socket.on('new_conversation', async ({ recipientId, conversation }) => {
        try {
            const recipientSocketId = global.users.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('conversation_created', conversation);
            }
        } catch (error) {
            console.error('Error sending new conversation notification:', error);
        }
    });

    // Handle private messages
    socket.on('send_message', async ({ recipientId, message, conversationId }) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(conversationId)) {
                throw new Error('Invalid conversation ID');
            }

            const currentTime = new Date();

            // Create new message
            const newMessage = new Message({
                conversationId: conversationId,
                sender: socket.userId,
                content: message,
                createdAt: currentTime
            });

            // Save message
            await newMessage.save();

            // Get populated message
            const populatedMessage = await Message.findById(newMessage._id)
                .populate('sender', 'name email')
                .lean();

            // Ensure proper date format
            const messageToSend = {
                ...populatedMessage,
                conversationId,
                createdAt: currentTime.toISOString()
            };

            // Update conversation's last message
            await mongoose.model('Conversation').findByIdAndUpdate(
                conversationId,
                {
                    lastMessage: newMessage._id,
                    updatedAt: currentTime
                }
            );

            // Send to recipient if online
            const recipientSocketId = global.users.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive_message', messageToSend);
            }

            // Send back to sender
            socket.emit('receive_message', messageToSend);

        } catch (error) {
            console.error('Error handling message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        global.users.delete(socket.userId);
        console.log('User disconnected:', socket.userId);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Also add a preflight handler for complex requests
app.options('*', cors()); // Enable preflight for all routes

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });