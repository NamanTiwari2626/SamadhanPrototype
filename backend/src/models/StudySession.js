const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
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
  sessionType: {
    type: String,
    enum: ['study', 'practice', 'revision', 'test'],
    default: 'study'
  },
  scheduledDateTime: {
    type: Date,
    required: true
  },
  duration: {
    planned: { type: Number, required: true }, // in minutes
    actual: { type: Number, default: 0 }
  },
  dayOfWeek: {
    type: Number,
    min: 0,
    max: 6 // 0 = Sunday, 6 = Saturday
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'missed', 'cancelled'],
    default: 'scheduled'
  },
  progress: {
    startTime: Date,
    endTime: Date,
    breaksDuration: { type: Number, default: 0 }, // total break time in minutes
    completionPercentage: { type: Number, default: 0 },
    notes: String
  },
  goals: [{
    description: String,
    completed: { type: Boolean, default: false }
  }],
  resources: [{
    type: { type: String, enum: ['book', 'video', 'pdf', 'website', 'notes'] },
    title: String,
    url: String
  }],
  performance: {
    focusRating: { type: Number, min: 1, max: 5 }, // self-rated focus level
    difficultyRating: { type: Number, min: 1, max: 5 }, // perceived difficulty
    satisfactionRating: { type: Number, min: 1, max: 5 }, // satisfaction with session
    questionsAttempted: { type: Number, default: 0 },
    questionsCorrect: { type: Number, default: 0 }
  },
  reminders: {
    enabled: { type: Boolean, default: true },
    beforeMinutes: { type: Number, default: 15 } // remind X minutes before
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    until: Date,
    parentSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudySession'
    }
  },
  linkedPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyPlan'
  },
  tags: [String]
}, {
  timestamps: true
});

// Auto-populate certain fields based on scheduledDateTime
studySessionSchema.pre('save', function(next) {
  if (this.isModified('scheduledDateTime')) {
    this.dayOfWeek = this.scheduledDateTime.getDay();
  }
  
  // Update completion percentage based on actual vs planned duration
  if (this.duration.actual > 0 && this.duration.planned > 0) {
    this.progress.completionPercentage = Math.min(
      (this.duration.actual / this.duration.planned) * 100,
      100
    );
  }
  
  next();
});

// Index for performance
studySessionSchema.index({ user: 1, status: 1 });
studySessionSchema.index({ user: 1, scheduledDateTime: 1 });
studySessionSchema.index({ subject: 1, dayOfWeek: 1 });
studySessionSchema.index({ linkedPlan: 1 });

// Virtual for accuracy percentage
studySessionSchema.virtual('accuracyPercentage').get(function() {
  if (this.performance.questionsAttempted === 0) return 0;
  return (this.performance.questionsCorrect / this.performance.questionsAttempted) * 100;
});

module.exports = mongoose.model('StudySession', studySessionSchema);