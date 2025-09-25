const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -refreshTokens')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'profile.firstName', 'profile.lastName', 'profile.bio', 
      'profile.phone', 'profile.location', 'profile.dateOfBirth',
      'academic.currentLevel', 'academic.targetExams', 'academic.subjects',
      'academic.institution', 'academic.graduationYear'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'profile.avatar': avatarUrl },
      { new: true }
    ).select('-password -refreshTokens');

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl,
      user
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('stats preferences academic')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate additional derived statistics
    const derivedStats = {
      studyHoursThisWeek: Math.floor(user.stats.totalStudyTime / 60), // Convert to hours
      averageSessionTime: user.stats.totalStudyTime > 0 ? 
        Math.floor(user.stats.totalStudyTime / (user.stats.questionsAnswered || 1)) : 0,
      accuracyRate: user.stats.questionsAnswered > 0 ?
        Math.floor((user.stats.questionsAnswered * 0.75)) : 0, // Mock calculation
      progressThisMonth: Math.min(user.stats.currentStreak * 10, 100),
      levelProgress: (user.stats.xp % 1000) / 10 // Percentage to next level
    };

    res.json({
      stats: {
        ...user.stats,
        ...derivedStats
      },
      academic: user.academic,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const allowedPreferences = [
      'studyHours', 'difficultyLevel', 'reminderSettings',
      'themes.darkMode', 'themes.primaryColor'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedPreferences.includes(key)) {
        updates[`preferences.${key}`] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

// Get user achievements
router.get('/achievements', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('stats.achievements stats.level stats.xp')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add available achievements that user can unlock
    const availableAchievements = [
      {
        type: 'first_quiz',
        title: 'Quiz Master',
        description: 'Complete your first quiz',
        points: 50,
        unlocked: user.stats.achievements.some(a => a.type === 'first_quiz')
      },
      {
        type: 'study_streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        points: 100,
        unlocked: user.stats.currentStreak >= 7
      },
      {
        type: 'questions_100',
        title: 'Century Club',
        description: 'Answer 100 questions correctly',
        points: 200,
        unlocked: user.stats.questionsAnswered >= 100
      }
    ];

    res.json({
      currentLevel: user.stats.level,
      totalXP: user.stats.xp,
      nextLevelXP: (user.stats.level * 1000),
      achievements: user.stats.achievements,
      availableAchievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// Get user's study dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent activity (mock data)
    const recentActivity = [
      {
        type: 'quiz_completed',
        title: 'Completed Mathematics Quiz',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        details: 'Score: 85%'
      },
      {
        type: 'study_session',
        title: 'Physics Study Session',
        timestamp: Date.now() - 5 * 60 * 60 * 1000,
        details: '45 minutes focused study'
      },
      {
        type: 'milestone_completed',
        title: 'Completed Calculus Chapter',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        details: 'Study plan milestone achieved'
      }
    ];

    // Calculate weekly progress
    const weeklyStats = {
      studyTime: user.stats.totalStudyTime % 300, // Mock weekly time
      questionsAnswered: user.stats.questionsAnswered % 50,
      quizzesCompleted: user.stats.quizzesCompleted % 10,
      streak: user.stats.currentStreak
    };

    res.json({
      user: {
        name: user.fullName,
        level: user.stats.level,
        xp: user.stats.xp,
        avatar: user.profile.avatar
      },
      weeklyStats,
      recentActivity,
      quickStats: {
        totalStudyHours: Math.floor(user.stats.totalStudyTime / 60),
        questionsAnswered: user.stats.questionsAnswered,
        currentStreak: user.stats.currentStreak,
        achievementsEarned: user.stats.achievements.length
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
  try {
    const { confirmPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user || !(await user.isPasswordCorrect(confirmPassword))) {
      return res.status(401).json({ message: 'Invalid password confirmation' });
    }

    // In production, you might want to soft-delete or archive the account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;