import { useState, useRef, useEffect } from 'react';
import { socketService } from '../../utils/socket';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Chat({ selectedChat, onNewMessage }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { user, token } = useAuth();
  
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const isScrolledNearBottom = 
        container && 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;

      if (isScrolledNearBottom || behavior === "instant") {
        messagesEndRef.current.scrollIntoView({ 
          behavior, 
          block: "end" 
        });
      }
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }
    return () => socketService.disconnect();
  }, [token]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log('New message received:', newMessage);
      if (selectedChat?._id === newMessage.conversationId) {
        setMessages(prev => [...prev, newMessage]);
        if (onNewMessage) onNewMessage();
      }
    };

    const cleanup = socketService.onMessage(handleNewMessage);
    return () => cleanup();
  }, [selectedChat?._id, onNewMessage]);

  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();
    }
  }, [selectedChat?._id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/chats/${selectedChat._id}`);
      setMessages(response.data.messages || []);
      setLoading(false);
      // Use instant scroll when loading initial messages
      setTimeout(() => scrollToBottom("instant"), 100);
      
      // Mark messages as read
      await api.put(`/api/chats/${selectedChat._id}/read`);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // Send message through socket first
      socketService.sendMessage(
        selectedChat.otherUser._id,
        message.trim(),
        selectedChat._id
      );

      // Clear input immediately for better UX
      setMessage('');

      // Save to database
      await api.post(`/api/chats/${selectedChat._id}`, {
        content: message.trim()
      });

      if (onNewMessage) onNewMessage();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-dark-400">Loading messages...</div>
      </div>
    );
  }

  return (
    <>
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 p-4 overflow-y-auto custom-scrollbar"
      >
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender._id === user._id
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700/50 text-dark-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {formatDate(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-dark-700/50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
}