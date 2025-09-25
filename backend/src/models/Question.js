const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  explanation: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'english', 'general-knowledge', 'reasoning', 'computer-science', 'history', 'geography']
  },
  topic: {
    type: String,
    required: true
  },
  subtopic: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'single-choice', 'true-false', 'numerical'],
    default: 'single-choice'
  },
  tags: [String],
  examType: {
    type: String,
    enum: ['jee-main', 'jee-advanced', 'neet', 'gate', 'cat', 'general'],
    default: 'general'
  },
  images: [String], // URLs to image files
  solution: {
    steps: [String],
    finalAnswer: String,
    hints: [String]
  },
  metadata: {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    source: String, // textbook, previous year, etc.
    year: Number,
    isVerified: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 }
  },
  statistics: {
    totalAttempts: { type: Number, default: 0 },
    correctAttempts: { type: Number, default: 0 },
    averageTime: { type: Number, default: 0 }, // in seconds
    difficultyRating: { type: Number, default: 0 } // user-rated difficulty
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
questionSchema.index({ subject: 1, difficulty: 1, isActive: 1 });
questionSchema.index({ topic: 1, subtopic: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ examType: 1 });
questionSchema.index({ 'statistics.totalAttempts': -1 }); // for frequently attempted questions

// Virtual for accuracy percentage
questionSchema.virtual('accuracyPercentage').get(function() {
  if (this.statistics.totalAttempts === 0) return 0;
  return (this.statistics.correctAttempts / this.statistics.totalAttempts) * 100;
});

module.exports = mongoose.model('Question', questionSchema);