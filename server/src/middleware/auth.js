import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth Header:', authHeader); // Debug log

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found'); // Debug log
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      const user = await User.findById(decoded._id);
      if (!user) {
        console.log('User not found for id:', decoded._id); // Debug log
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = {
        id: user._id,
        email: user.email,
        name: user.name
      };
      
      console.log('Authenticated user:', req.user); // Debug log
      next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError); // Debug log
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findOne({ _id: decoded._id });
    console.log('Found user:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};