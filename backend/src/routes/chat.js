const express = require('express');
const ChatService = require('../services/chatService');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/chat/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Send message to AI
router.post('/message', auth, upload.array('files', 5), async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    })) : [];

    const parsedContext = context ? JSON.parse(context) : {};

    const response = await ChatService.processMessage(
      req.user._id,
      message,
      files,
      parsedContext
    );

    res.json(response);
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ 
      message: 'Failed to process message',
      error: error.message 
    });
  }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const history = await ChatService.getChatHistory(
      req.user._id,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ messages: history });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// Provide feedback on AI response
router.post('/feedback/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { rating, comment, category } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const success = await ChatService.provideFeedback(
      messageId,
      req.user._id,
      rating,
      comment,
      category
    );

    if (success) {
      res.json({ message: 'Feedback submitted successfully' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Voice message processing (placeholder for future implementation)
router.post('/voice', auth, upload.single('audio'), async (req, res) => {
  try {
    // This would integrate with speech-to-text services
    res.status(501).json({ message: 'Voice processing not yet implemented' });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({ message: 'Failed to process voice message' });
  }
});

module.exports = router;