const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  targetDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
});

const studyPlanSchema = new mongoose.Schema({
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
  description: String,
  category: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'long-term'],
    required: true
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  target: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }, // hours, problems, chapters, etc.
  },
  current: {
    value: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  deadline: {
    type: Date,
    required: true
  },
  subject: String,
  examType: {
    type: String,
    enum: ['jee-main', 'jee-advanced', 'neet', 'gate', 'cat', 'general'],
    default: 'general'
  },
  milestones: [milestoneSchema],
  schedule: {
    dailyGoal: Number,
    weeklyGoal: Number,
    preferredTime: String, // morning, afternoon, evening, night
    studyDuration: Number // minutes per session
  },
  progress: {
    percentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    daysRemaining: Number,
    onTrack: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  completedAt: Date,
  notes: String,
  reminders: {
    enabled: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily'
    },
    time: String // HH:MM format
  }
}, {
  timestamps: true
});

// Update progress percentage before saving
studyPlanSchema.pre('save', function(next) {
  if (this.target.value > 0) {
    this.progress.percentage = Math.min((this.current.value / this.target.value) * 100, 100);
  }
  
  // Calculate days remaining
  const now = new Date();
  const deadline = new Date(this.deadline);
  this.progress.daysRemaining = Math.max(0, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)));
  
  // Determine if on track
  const expectedProgress = this.progress.daysRemaining > 0 ? 
    ((Date.now() - this.createdAt) / (this.deadline - this.createdAt)) * 100 : 100;
  this.progress.onTrack = this.progress.percentage >= expectedProgress * 0.8; // 20% tolerance
  
  next();
});

// Index for performance
studyPlanSchema.index({ user: 1, status: 1 });
studyPlanSchema.index({ deadline: 1, status: 1 });
studyPlanSchema.index({ category: 1, priority: 1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);