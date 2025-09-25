const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'voice', 'file'],
    default: 'text'
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  context: {
    subject: String,
    topic: String,
    sessionId: String,
    previousMessages: [{
      role: String,
      content: String,
      timestamp: Date
    }]
  },
  aiResponse: {
    model: String, // gpt-4, gpt-3.5-turbo, etc.
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number
    },
    responseTime: Number, // in milliseconds
    confidence: Number // 0-1 rating
  },
  files: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['helpful', 'not_helpful', 'accurate', 'inaccurate', 'like', 'dislike']
    },
    timestamp: { type: Date, default: Date.now }
  }],
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    category: {
      type: String,
      enum: ['accuracy', 'helpfulness', 'clarity', 'completeness']
    }
  },
  status: {
    type: String,
    enum: ['sent', 'processing', 'delivered', 'failed'],
    default: 'sent'
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionDuration: Number,
    isEdited: { type: Boolean, default: false },
    editedAt: Date
  }
}, {
  timestamps: true
});

// Index for performance
chatMessageSchema.index({ user: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1, createdAt: -1 });
chatMessageSchema.index({ 'context.sessionId': 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);