import { useState } from 'react';
import DashboardLayout from '../dashboard/DashboardLayout';

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);

  // Mock data - replace with API call
  const chats = [
    {
      id: 1,
      user: {
        name: 'Sarah Wilson',
        avatar: null,
        online: true,
      },
      lastMessage: {
        text: "Great! I'll see you there at 3 PM.",
        timestamp: '2 min ago',
        unread: true,
      },
      messages: [
        {
          id: 1,
          sender: 'them',
          text: "Hi, I'm interested in borrowing your mountain bike.",
          timestamp: '1:42 PM',
        },
        {
          id: 2,
          sender: 'me',
          text: 'Sure! When would you like to pick it up?',
          timestamp: '1:45 PM',
        },
        {
          id: 3,
          sender: 'them',
          text: 'Would 3 PM today work?',
          timestamp: '1:47 PM',
        },
        {
          id: 4,
          sender: 'me',
          text: 'Yes, that works perfectly!',
          timestamp: '1:48 PM',
        },
        {
          id: 5,
          sender: 'them',
          text: "Great! I'll see you there at 3 PM.",
          timestamp: '1:50 PM',
        },
      ],
    },
    {
      id: 2,
      user: {
        name: 'John Doe',
        avatar: null,
        online: false,
      },
      lastMessage: {
        text: 'Thanks for the camera, it worked great!',
        timestamp: '1 hour ago',
        unread: false,
      },
      messages: [
        {
          id: 1,
          sender: 'them',
          text: 'Thanks for the camera, it worked great!',
          timestamp: '12:30 PM',
        },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* Chat List */}
        <div className="w-96 border-r border-dark-700/50">
          <div className="h-full flex flex-col bg-dark-800/30 backdrop-blur-xl rounded-l-2xl">
            <div className="p-4 border-b border-dark-700/50">
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-dark-700/50">
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`group cursor-pointer ${
                      selectedChat?.id === chat.id ? 'bg-dark-800/50' : 'hover:bg-dark-800/50'
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <span className="text-lg font-medium text-primary-400">
                              {chat.user.name.charAt(0)}
                            </span>
                          </div>
                          {chat.user.online && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-dark-800" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white">{chat.user.name}</h3>
                            <p className="text-xs text-dark-400">{chat.lastMessage.timestamp}</p>
                          </div>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-sm text-dark-300 truncate">{chat.lastMessage.text}</p>
                            {chat.lastMessage.unread && (
                              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-500 text-xs font-medium text-white">
                                1
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-dark-800/30 backdrop-blur-xl rounded-r-2xl">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-dark-700/50">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary-400">
                        {selectedChat.user.name.charAt(0)}
                      </span>
                    </div>
                    {selectedChat.user.online && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-dark-800" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-white">{selectedChat.user.name}</h3>
                    <p className="text-xs text-dark-400">
                      {selectedChat.user.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'me'
                          ? 'bg-primary-500 text-white'
                          : 'bg-dark-700/50 text-dark-200'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-dark-700/50">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-primary-500 transition-all duration-300 ease-in-out transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-500/25 active:translate-y-0">
                    Send
                  </button>
                </div>
              </div>
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