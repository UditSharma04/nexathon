import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const SOCKET_URL = 'https://sharehub-q3oi.onrender.com';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Create socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            cors: {
                origin: "https://nexathon-flame.vercel.app"
            }
        });

        // Set socket state
        setSocket(socketRef.current);

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (!socketRef.current) return;

        // Message listener
        const handleReceiveMessage = (data) => {
            setMessages(prev => [...prev, data]);
        };

        // User joined listener
        const handleUserJoined = ({ username }) => {
            setMessages(prev => [...prev, { 
                system: true, 
                message: `${username} joined the chat`
            }]);
        };

        // User left listener
        const handleUserLeft = ({ username }) => {
            setMessages(prev => [...prev, { 
                system: true, 
                message: `${username} left the chat`
            }]);
        };

        // Active users listener
        const handleActiveUsers = (users) => {
            setActiveUsers(users);
        };

        // Typing indicator listener
        const handleUserTyping = ({ username }) => {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(username);
                return newSet;
            });
            setTimeout(() => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(username);
                    return newSet;
                });
            }, 1000);
        };

        // Add event listeners
        socketRef.current.on('receive_message', handleReceiveMessage);
        socketRef.current.on('user_joined', handleUserJoined);
        socketRef.current.on('user_left', handleUserLeft);
        socketRef.current.on('active_users', handleActiveUsers);
        socketRef.current.on('user_typing', handleUserTyping);

        // Clean up event listeners
        return () => {
            socketRef.current.off('receive_message', handleReceiveMessage);
            socketRef.current.off('user_joined', handleUserJoined);
            socketRef.current.off('user_left', handleUserLeft);
            socketRef.current.off('active_users', handleActiveUsers);
            socketRef.current.off('user_typing', handleUserTyping);
        };
    }, []); // Empty dependency array as we're using socketRef

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleJoin = (e) => {
        e.preventDefault();
        if (username.trim() && socketRef.current) {
            socketRef.current.emit('user_join', username);
            setIsJoined(true);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socketRef.current) {
            socketRef.current.emit('send_message', { message });
            setMessage('');
        }
    };

    const handleTyping = () => {
        if (socketRef.current) {
            socketRef.current.emit('typing');
        }
    };

    if (!isJoined) {
        return (
            <Box
                component="form"
                onSubmit={handleJoin}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 400,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                }}
            >
                <Typography variant="h5">Join Chat</Typography>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained">Join</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 100px)' }}>
            <Paper sx={{ width: 200, p: 2 }}>
                <Typography variant="h6">Active Users</Typography>
                <List>
                    {activeUsers.map((user, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={user} />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Paper sx={{ flex: 1, mb: 2, p: 2, overflow: 'auto' }}>
                    <List>
                        {messages.map((msg, index) => (
                            <React.Fragment key={index}>
                                {msg.system ? (
                                    <ListItem>
                                        <ListItemText 
                                            secondary={msg.message}
                                            sx={{ textAlign: 'center' }}
                                        />
                                    </ListItem>
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary={msg.username}
                                            secondary={msg.message}
                                            sx={{
                                                '& .MuiListItemText-primary': {
                                                    color: msg.userId === socketRef.current?.id ? 'primary.main' : 'text.primary'
                                                }
                                            }}
                                        />
                                    </ListItem>
                                )}
                                <Divider />
                            </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>
                    {typingUsers.size > 0 && (
                        <Typography variant="caption" sx={{ pl: 2 }}>
                            {Array.from(typingUsers).join(', ')} typing...
                        </Typography>
                    )}
                </Paper>

                <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleTyping}
                        placeholder="Type a message..."
                    />
                    <Button type="submit" variant="contained">Send</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Chat;
