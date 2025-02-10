import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import Chat from './Chat';
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

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user, token } = useAuth();

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    }
    return () => socketService.disconnect();
  }, [token]);

  // Listen for new conversations
  useEffect(() => {
    const handleNewConversation = (conversation) => {
      console.log('New conversation received in Messages:', conversation);
      setConversations(prev => {
        // Check if conversation already exists
        const exists = prev.some(conv => conv._id === conversation._id);
        if (exists) return prev;

        // Format the new conversation
        const otherParticipant = conversation.participants.find(
          p => p._id !== user._id
        );

        const formattedConversation = {
          _id: conversation._id,
          otherUser: otherParticipant || {
            _id: 'unknown',
            name: 'Unknown User',
            email: 'unknown'
          },
          item: conversation.item,
          lastMessage: conversation.lastMessage,
          messages: conversation.messages,
          updatedAt: conversation.updatedAt || new Date()
        };

        return [formattedConversation, ...prev];
      });
    };

    const cleanup = socketService.onNewConversation(handleNewConversation);
    return () => cleanup();
  }, [user._id]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (location.state?.conversationId) {
      const conversation = conversations.find(
        conv => conv._id === location.state.conversationId
      );
      if (conversation) {
        setSelectedChat(conversation);
      }
    }
  }, [location.state, conversations]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/api/conversations');
      console.log('Raw conversations:', response.data);
      
      const formattedConversations = response.data.map(conv => {
        const otherParticipant = conv.participants.find(
          p => p._id !== user._id
        );
        
        if (!otherParticipant) {
          console.error('Could not find other participant', {
            currentUser: user,
            participants: conv.participants
          });
        }

        return {
          _id: conv._id,
          otherUser: otherParticipant || {
            _id: 'unknown',
            name: 'Unknown User',
            email: 'unknown'
          },
          item: conv.item,
          lastMessage: conv.lastMessage,
          messages: conv.messages,
          updatedAt: conv.updatedAt || new Date()
        };
      });

      // Sort conversations by updatedAt
      formattedConversations.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      console.log('Formatted conversations:', formattedConversations);
      setConversations(formattedConversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      console.error('User object:', user);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* Chat List */}
        <div className="w-96 border-r border-dark-700/50">
          <div className="h-full flex flex-col bg-dark-800/30 backdrop-blur-xl rounded-l-2xl">
            <div className="p-4 border-b border-dark-700/50">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-dark-400">Loading conversations...</div>
                </div>
              ) : (
                <ul className="divide-y divide-dark-700/50">
                  {conversations.map((conversation) => (
                    <li
                      key={conversation._id}
                      className={`group cursor-pointer ${
                        selectedChat?._id === conversation._id ? 'bg-dark-800/50' : 'hover:bg-dark-800/50'
                      }`}
                      onClick={() => setSelectedChat(conversation)}
                    >
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                              <span className="text-lg font-medium text-primary-400">
                                {conversation.otherUser.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-white">
                                {conversation.otherUser.name}
                              </h3>
                              {conversation.lastMessage && (
                                <p className="text-xs text-dark-400">
                                  {formatDate(conversation.lastMessage.createdAt)}
                                </p>
                              )}
                            </div>
                            {conversation.item && (
                              <p className="text-xs text-primary-400 mt-1">
                                Re: {conversation.item.name}
                              </p>
                            )}
                            {conversation.lastMessage && (
                              <p className="text-sm text-dark-300 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-dark-800/30 backdrop-blur-xl rounded-r-2xl">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-dark-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <span className="text-lg font-medium text-primary-400">
                          {selectedChat.otherUser.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-white">
                        {selectedChat.otherUser.name}
                      </h3>
                      {selectedChat.item && (
                        <p className="text-xs text-primary-400">
                          Re: {selectedChat.item.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Component */}
              <Chat selectedChat={selectedChat} onNewMessage={fetchConversations} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-dark-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-dark-300">No chat selected</h3>
                <p className="mt-1 text-sm text-dark-400">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}