import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  socket = null;
  messageCallback = null;
  conversationCallback = null;

  connect(token) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      if (this.messageCallback) {
        this.messageCallback(message);
      }
    });

    this.socket.on('conversation_created', (conversation) => {
      console.log('New conversation received:', conversation);
      if (this.conversationCallback) {
        this.conversationCallback(conversation);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageCallback = null;
      this.conversationCallback = null;
    }
  }

  sendMessage(recipientId, message, conversationId) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('Sending message:', { recipientId, message, conversationId });
    this.socket.emit('send_message', {
      recipientId,
      message,
      conversationId
    });
  }

  notifyNewConversation(recipientId, conversation) {
    if (!this.socket?.connected) {
      console.error('Socket not connected');
      return;
    }
    
    console.log('Notifying new conversation:', { recipientId, conversation });
    this.socket.emit('new_conversation', {
      recipientId,
      conversation
    });
  }

  onMessage(callback) {
    this.messageCallback = callback;
    return () => {
      this.messageCallback = null;
    };
  }

  onNewConversation(callback) {
    this.conversationCallback = callback;
    return () => {
      this.conversationCallback = null;
    };
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();