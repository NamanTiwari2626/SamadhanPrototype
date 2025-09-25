const mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    text: { type: String, required: true, trim: true },
    attachments: [{
      type: { type: String, enum: ['image', 'file', 'link'] },
      url: String,
      filename: String,
      size: Number
    }]
  },
  channel: {
    type: String,
    enum: ['general', 'study-groups', 'doubt-solving', 'announcements', 'jee-main', 'jee-advanced', 'neet'],
    default: 'general'
  },
  messageType: {
    type: String,
    enum: ['message', 'announcement', 'poll', 'resource_share'],
    default: 'message'
  },
  tags: [String],
  mentions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    position: Number // character position in the message
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    timestamp: { type: Date, default: Date.now }
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: { type: Date, default: Date.now },
    reactions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      emoji: String
    }]
  }],
  status: {
    type: String,
    enum: ['active', 'edited', 'deleted', 'flagged'],
    default: 'active'
  },
  moderation: {
    isFlagged: { type: Boolean, default: false },
    flaggedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      timestamp: { type: Date, default: Date.now }
    }],
    isApproved: { type: Boolean, default: true },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date
  },
  engagement: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    bookmarks: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  isSticky: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  editHistory: [{
    content: String,
    editedAt: { type: Date, default: Date.now },
    editReason: String
  }]
}, {
  timestamps: true
});

// Index for performance
communityMessageSchema.index({ channel: 1, createdAt: -1 });
communityMessageSchema.index({ author: 1, createdAt: -1 });
communityMessageSchema.index({ tags: 1 });
communityMessageSchema.index({ 'moderation.isFlagged': 1 });

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);