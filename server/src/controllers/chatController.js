import Chat from '../models/Chat.js';
import Conversation from '../models/Conversation.js';

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    let chat = await Chat.findOne({ conversation: conversationId })
      .populate('messages.sender', 'name')
      .populate('participants', 'name email');

    if (!chat) {
      // Create new chat if it doesn't exist
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      chat = new Chat({
        conversation: conversationId,
        participants: conversation.participants,
        messages: []
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    let chat = await Chat.findOne({ conversation: conversationId });
    
    if (!chat) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      chat = new Chat({
        conversation: conversationId,
        participants: conversation.participants,
        messages: []
      });
    }

    // Add new message
    const newMessage = {
      sender: senderId,
      content,
      createdAt: new Date()
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      content,
      sender: senderId,
      timestamp: new Date()
    };

    await chat.save();

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        createdAt: new Date()
      }
    });

    // Populate sender info before sending response
    const populatedChat = await Chat.findById(chat._id)
      .populate('messages.sender', 'name')
      .populate('participants', 'name email');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ conversation: conversationId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages from other participants as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== userId && !message.read) {
        message.read = true;
      }
    });

    await chat.save();
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
}; 