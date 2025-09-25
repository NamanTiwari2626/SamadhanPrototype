const express = require('express');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const StudySession = require('../models/StudySession');
const StudyPlan = require('../models/StudyPlan');
const ChatMessage = require('../models/ChatMessage');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get comprehensive user analytics
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '7d' } = req.query; // 7d, 30d, 90d, 1y
    
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const daysBack = periodDays[period] || 7;
    const startDate = moment().subtract(daysBack, 'days').toDate();

    // Parallel data fetching for better performance
    const [
      userStats,
      studySessionStats,
      quizStats,
      planStats,
      chatStats
    ] = await Promise.all([
      // User basic stats
      User.findById(userId).select('stats academic').lean(),
      
      // Study session analytics
      StudySession.aggregate([
        { 
          $match: { 
            user: userId, 
            scheduledDateTime: { $gte: startDate },
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            totalStudyTime: { $sum: '$duration.actual' },
            avgFocusRating: { $avg: '$performance.focusRating' },
            avgSatisfaction: { $avg: '$performance.satisfactionRating' },
            subjectBreakdown: { $push: '$subject' }
          }
        }
      ]),
      
      // Quiz performance analytics
      Quiz.aggregate([
        {
          $lookup: {
            from: 'users', // Assuming you track quiz attempts
            localField: '_id',
            foreignField: 'attemptedQuizzes.quizId',
            as: 'attempts'
          }
        },
        {
          $match: { 'attempts.userId': userId }
        },
        {
          $group: {
            _id: null,
            totalQuizzes: { $sum: 1 },
            avgScore: { $avg: '$statistics.averageScore' }
          }
        }
      ]),
      
      // Study plan progress
      StudyPlan.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalPlans: { $sum: 1 },
            completedPlans: { 
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
            },
            avgProgress: { $avg: '$progress.percentage' }
          }
        }
      ]),
      
      // Chat interaction stats
      ChatMessage.aggregate([
        { 
          $match: { 
            user: userId, 
            createdAt: { $gte: startDate } 
          } 
        },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            aiInteractions: { 
              $sum: { $cond: [{ $eq: ['$sender', 'user'] }, 1, 0] } 
            }
          }
        }
      ])
    ]);

    // Calculate daily activity for the period
    const dailyActivity = await StudySession.aggregate([
      {
        $match: {
          user: userId,
          scheduledDateTime: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledDateTime' } },
          sessions: { $sum: 1 },
          studyTime: { $sum: '$duration.actual' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Subject performance breakdown
    const subjectPerformance = await StudySession.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$subject',
          totalTime: { $sum: '$duration.actual' },
          sessionCount: { $sum: 1 },
          avgFocus: { $avg: '$performance.focusRating' },
          avgDifficulty: { $avg: '$performance.difficultyRating' }
        }
      },
      { $sort: { totalTime: -1 } }
    ]);

    res.json({
      period,
      overview: {
        level: userStats?.stats?.level || 1,
        totalXP: userStats?.stats?.xp || 0,
        currentStreak: userStats?.stats?.currentStreak || 0,
        longestStreak: userStats?.stats?.longestStreak || 0
      },
      studyStats: {
        totalSessions: studySessionStats[0]?.totalSessions || 0,
        totalStudyTime: studySessionStats[0]?.totalStudyTime || 0,
        averageFocus: Math.round(studySessionStats[0]?.avgFocusRating || 0),
        averageSatisfaction: Math.round(studySessionStats[0]?.avgSatisfaction || 0)
      },
      planStats: {
        totalPlans: planStats[0]?.totalPlans || 0,
        completedPlans: planStats[0]?.completedPlans || 0,
        averageProgress: Math.round(planStats[0]?.avgProgress || 0)
      },
      engagementStats: {
        chatMessages: chatStats[0]?.totalMessages || 0,
        aiInteractions: chatStats[0]?.aiInteractions || 0
      },
      dailyActivity,
      subjectPerformance: subjectPerformance.slice(0, 6) // Top 6 subjects
    });

  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Get learning insights and recommendations
router.get('/insights', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).lean();
    
    const insights = [];
    const recommendations = [];

    // Analyze study patterns
    const recentSessions = await StudySession.find({
      user: userId,
      status: 'completed',
      scheduledDateTime: { $gte: moment().subtract(14, 'days').toDate() }
    }).lean();

    if (recentSessions.length > 0) {
      // Focus pattern analysis
      const avgFocus = recentSessions.reduce((sum, s) => sum + (s.performance?.focusRating || 0), 0) / recentSessions.length;
      
      if (avgFocus < 3) {
        insights.push({
          type: 'warning',
          title: 'Focus Needs Attention',
          description: 'Your focus ratings have been below average recently.',
          metric: Math.round(avgFocus * 10) / 10
        });
        recommendations.push({
          type: 'study_technique',
          title: 'Try the Pomodoro Technique',
          description: 'Break your study sessions into 25-minute focused intervals with short breaks.',
          priority: 'high'
        });
      } else if (avgFocus >= 4) {
        insights.push({
          type: 'success',
          title: 'Excellent Focus',
          description: 'You\'ve been maintaining high focus levels in your study sessions.',
          metric: Math.round(avgFocus * 10) / 10
        });
      }

      // Study time consistency
      const studyDays = new Set(recentSessions.map(s => 
        moment(s.scheduledDateTime).format('YYYY-MM-DD')
      )).size;
      
      const consistency = (studyDays / 14) * 100;
      
      if (consistency < 50) {
        insights.push({
          type: 'warning',
          title: 'Inconsistent Study Schedule',
          description: `You've studied on ${studyDays} out of the last 14 days.`,
          metric: Math.round(consistency)
        });
        recommendations.push({
          type: 'habit',
          title: 'Build Daily Study Habit',
          description: 'Try to study for at least 15 minutes every day to build consistency.',
          priority: 'medium'
        });
      }
    }

    // Subject balance analysis
    const subjectTime = {};
    recentSessions.forEach(session => {
      subjectTime[session.subject] = (subjectTime[session.subject] || 0) + session.duration.actual;
    });

    const totalTime = Object.values(subjectTime).reduce((sum, time) => sum + time, 0);
    if (totalTime > 0) {
      const subjects = Object.keys(subjectTime);
      const dominantSubject = subjects.reduce((a, b) => 
        subjectTime[a] > subjectTime[b] ? a : b
      );
      
      if (subjectTime[dominantSubject] / totalTime > 0.6) {
        insights.push({
          type: 'info',
          title: 'Subject Imbalance',
          description: `You're spending ${Math.round((subjectTime[dominantSubject] / totalTime) * 100)}% of your time on ${dominantSubject}.`,
          metric: Math.round((subjectTime[dominantSubject] / totalTime) * 100)
        });
        recommendations.push({
          type: 'balance',
          title: 'Diversify Your Studies',
          description: 'Consider allocating more time to other subjects for balanced preparation.',
          priority: 'medium'
        });
      }
    }

    // Progress insights
    if (user.stats.currentStreak >= 7) {
      insights.push({
        type: 'success',
        title: 'Great Momentum!',
        description: `You're on a ${user.stats.currentStreak}-day study streak.`,
        metric: user.stats.currentStreak
      });
    } else if (user.stats.currentStreak === 0) {
      recommendations.push({
        type: 'motivation',
        title: 'Start a New Streak',
        description: 'Begin your study streak today with just 15 minutes of focused learning.',
        priority: 'high'
      });
    }

    res.json({
      insights,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      generatedAt: Date.now()
    });

  } catch (error) {
    console.error('Learning insights error:', error);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
});

// Get performance comparison with peers (anonymized)
router.get('/peer-comparison', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('academic stats').lean();
    
    // Find users with similar academic profile
    const similarUsers = await User.find({
      _id: { $ne: userId },
      'academic.currentLevel': user.academic.currentLevel,
      'academic.targetExams': { $in: user.academic.targetExams || [] }
    }).select('stats').lean();

    if (similarUsers.length === 0) {
      return res.json({
        message: 'Not enough similar users for comparison',
        userStats: user.stats
      });
    }

    // Calculate peer averages
    const peerAverages = {
      level: similarUsers.reduce((sum, u) => sum + u.stats.level, 0) / similarUsers.length,
      xp: similarUsers.reduce((sum, u) => sum + u.stats.xp, 0) / similarUsers.length,
      studyTime: similarUsers.reduce((sum, u) => sum + u.stats.totalStudyTime, 0) / similarUsers.length,
      questionsAnswered: similarUsers.reduce((sum, u) => sum + u.stats.questionsAnswered, 0) / similarUsers.length,
      currentStreak: similarUsers.reduce((sum, u) => sum + u.stats.currentStreak, 0) / similarUsers.length
    };

    // Calculate percentiles
    const calculatePercentile = (value, peerValues) => {
      const sorted = peerValues.sort((a, b) => a - b);
      const index = sorted.findIndex(v => v >= value);
      return index === -1 ? 100 : Math.round((index / sorted.length) * 100);
    };

    const comparison = {
      level: {
        user: user.stats.level,
        peerAverage: Math.round(peerAverages.level * 10) / 10,
        percentile: calculatePercentile(user.stats.level, similarUsers.map(u => u.stats.level))
      },
      studyTime: {
        user: user.stats.totalStudyTime,
        peerAverage: Math.round(peerAverages.studyTime),
        percentile: calculatePercentile(user.stats.totalStudyTime, similarUsers.map(u => u.stats.totalStudyTime))
      },
      questionsAnswered: {
        user: user.stats.questionsAnswered,
        peerAverage: Math.round(peerAverages.questionsAnswered),
        percentile: calculatePercentile(user.stats.questionsAnswered, similarUsers.map(u => u.stats.questionsAnswered))
      },
      currentStreak: {
        user: user.stats.currentStreak,
        peerAverage: Math.round(peerAverages.currentStreak * 10) / 10,
        percentile: calculatePercentile(user.stats.currentStreak, similarUsers.map(u => u.stats.currentStreak))
      }
    };

    res.json({
      comparison,
      peerGroupSize: similarUsers.length,
      academicLevel: user.academic.currentLevel,
      targetExams: user.academic.targetExams
    });

  } catch (error) {
    console.error('Peer comparison error:', error);
    res.status(500).json({ message: 'Failed to generate peer comparison' });
  }
});

// Export user data for analysis (GDPR compliance)
router.get('/export', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [user, studySessions, chatMessages, studyPlans] = await Promise.all([
      User.findById(userId).select('-password -refreshTokens').lean(),
      StudySession.find({ user: userId }).lean(),
      ChatMessage.find({ user: userId }).lean(),
      StudyPlan.find({ user: userId }).lean()
    ]);

    const exportData = {
      user,
      studySessions,
      chatMessages: chatMessages.map(msg => ({
        ...msg,
        // Remove sensitive AI response data
        aiResponse: msg.aiResponse ? { model: msg.aiResponse.model, responseTime: msg.aiResponse.responseTime } : undefined
      })),
      studyPlans,
      exportedAt: Date.now()
    };

    res.json({
      message: 'User data exported successfully',
      data: exportData
    });

  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({ message: 'Failed to export user data' });
  }
});

module.exports = router;