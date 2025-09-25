const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'english', 'general-knowledge', 'reasoning', 'computer-science', 'history', 'geography']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  duration: {
    type: Number,
    required: true // in minutes
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  tags: [String],
  examType: {
    type: String,
    enum: ['jee-main', 'jee-advanced', 'neet', 'gate', 'cat', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  settings: {
    allowReview: { type: Boolean, default: true },
    showCorrectAnswers: { type: Boolean, default: true },
    randomizeQuestions: { type: Boolean, default: false },
    randomizeOptions: { type: Boolean, default: false },
    passingScore: { type: Number, default: 60 } // percentage
  },
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
quizSchema.index({ subject: 1, difficulty: 1, isActive: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ examType: 1 });

module.exports = mongoose.model('Quiz', quizSchema);