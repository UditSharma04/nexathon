import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  socket = null;

  connect(token) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(recipientId, message) {
    if (!this.socket) return;
    
    this.socket.emit('send_message', {
      recipientId,
      message,
    });
  }

  onMessage(callback) {
    if (!this.socket) return;
    
    this.socket.on('receive_message', callback);
  }

  onUserStatus(callback) {
    if (!this.socket) return;
    
    this.socket.on('user_status', callback);
  }
}

export const socketService = new SocketService(); 