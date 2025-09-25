const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    dateOfBirth: Date,
    phone: String,
    bio: String,
    location: String
  },
  academic: {
    currentLevel: {
      type: String,
      enum: ['high_school', 'undergraduate', 'graduate', 'postgraduate'],
      default: 'high_school'
    },
    targetExams: [String],
    subjects: [String],
    institution: String,
    graduationYear: Number
  },
  preferences: {
    studyHours: { type: Number, default: 4 },
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    reminderSettings: {
      studyReminders: { type: Boolean, default: true },
      breakReminders: { type: Boolean, default: true },
      goalReminders: { type: Boolean, default: true }
    },
    themes: {
      darkMode: { type: Boolean, default: false },
      primaryColor: { type: String, default: '#3B82F6' }
    }
  },
  stats: {
    totalStudyTime: { type: Number, default: 0 }, // in minutes
    questionsAnswered: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    achievements: [{
      type: { type: String },
      title: String,
      description: String,
      earnedAt: { type: Date, default: Date.now },
      points: Number
    }]
  },
  counselingData: {
    assessmentCompleted: { type: Boolean, default: false },
    careerRecommendations: [{
      field: String,
      score: Number,
      reasons: [String],
      suggestedCareers: [String]
    }],
    personalityType: String,
    strengths: [String],
    areasForImprovement: [String]
  },
  role: {
    type: String,
    enum: ['student', 'educator', 'admin'],
    default: 'student'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  },
  refreshTokens: [String],
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password
userSchema.methods.isPasswordCorrect = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'fallback-secret-key',
    {
      expiresIn: process.env.JWT_EXPIRE || '1d'
    }
  );
};

// Instance method to generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    }
  );
};

// Method to update user activity
userSchema.methods.updateActivity = function() {
  this.stats.lastActive = Date.now();
  return this.save();
};

// Method to add XP and level up
userSchema.methods.addXP = function(points) {
  this.stats.xp += points;
  const newLevel = Math.floor(this.stats.xp / 1000) + 1;
  if (newLevel > this.stats.level) {
    this.stats.level = newLevel;
    // Could emit level up event here
  }
  return this.save();
};

module.exports = mongoose.model('User', userSchema);