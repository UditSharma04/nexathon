const socketIO = require('socket.io');

function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    // Store connected users
    const users = new Map();

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle user joining
        socket.on('user_join', (username) => {
            users.set(socket.id, username);
            io.emit('user_joined', { username, userId: socket.id });
            io.emit('active_users', Array.from(users.values()));
        });

        // Handle chat messages
        socket.on('send_message', (data) => {
            const { message } = data;
            const username = users.get(socket.id);
            io.emit('receive_message', {
                message,
                username,
                userId: socket.id,
                timestamp: new Date().toISOString()
            });
        });

        // Handle typing status
        socket.on('typing', () => {
            const username = users.get(socket.id);
            socket.broadcast.emit('user_typing', { username });
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            const username = users.get(socket.id);
            users.delete(socket.id);
            io.emit('user_left', { username, userId: socket.id });
            io.emit('active_users', Array.from(users.values()));
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

module.exports = initializeSocket;
