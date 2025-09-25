const express = require('express');
const StudySession = require('../models/StudySession');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// Get study sessions for a date range
router.get('/sessions', auth, async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    const filter = { user: req.user._id };
    
    if (startDate && endDate) {
      filter.scheduledDateTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (status) filter.status = status;

    const sessions = await StudySession.find(filter)
      .sort({ scheduledDateTime: 1 })
      .lean();

    res.json({ sessions });
  } catch (error) {
    console.error('Fetch sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch study sessions' });
  }
});

// Create new study session
router.post('/sessions', auth, async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      user: req.user._id
    };

    const session = new StudySession(sessionData);
    await session.save();

    res.status(201).json({
      message: 'Study session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Failed to create study session' });
  }
});

// Get specific study session
router.get('/sessions/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('linkedPlan');

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Fetch session error:', error);
    res.status(500).json({ message: 'Failed to fetch study session' });
  }
});

// Update study session
router.put('/sessions/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    res.json({
      message: 'Study session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Failed to update study session' });
  }
});

// Start study session
router.patch('/sessions/:id/start', auth, async (req, res) => {
  try {
    const session = await StudySession.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    session.status = 'in-progress';
    session.progress.startTime = Date.now();
    await session.save();

    res.json({
      message: 'Study session started',
      session
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Failed to start study session' });
  }
});

// Complete study session
router.patch('/sessions/:id/complete', auth, async (req, res) => {
  try {
    const { 
      actualDuration, 
      focusRating, 
      difficultyRating, 
      satisfactionRating,
      questionsAttempted = 0,
      questionsCorrect = 0,
      notes 
    } = req.body;

    const session = await StudySession.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    session.status = 'completed';
    session.progress.endTime = Date.now();
    session.duration.actual = actualDuration;
    session.performance = {
      focusRating,
      difficultyRating,
      satisfactionRating,
      questionsAttempted,
      questionsCorrect
    };
    session.progress.notes = notes;

    await session.save();

    // Update user statistics
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    user.stats.totalStudyTime += actualDuration;
    user.stats.questionsAnswered += questionsAttempted;

    // Award XP based on session completion
    let xpGained = 20; // Base XP for completing session
    xpGained += Math.floor(actualDuration / 30) * 5; // Bonus for longer sessions
    if (focusRating >= 4) xpGained += 10; // Focus bonus

    await user.addXP(xpGained);

    res.json({
      message: 'Study session completed successfully',
      session,
      xpGained
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Failed to complete study session' });
  }
});

// Mark session as missed
router.patch('/sessions/:id/missed', auth, async (req, res) => {
  try {
    const session = await StudySession.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    session.status = 'missed';
    await session.save();

    res.json({
      message: 'Session marked as missed',
      session
    });
  } catch (error) {
    console.error('Mark missed error:', error);
    res.status(500).json({ message: 'Failed to mark session as missed' });
  }
});

// Get weekly timetable
router.get('/weekly', auth, async (req, res) => {
  try {
    const { weekStart } = req.query;
    const startOfWeek = weekStart ? new Date(weekStart) : moment().startOf('week').toDate();
    const endOfWeek = moment(startOfWeek).endOf('week').toDate();

    const sessions = await StudySession.find({
      user: req.user._id,
      scheduledDateTime: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    }).sort({ scheduledDateTime: 1 }).lean();

    // Group sessions by day of week
    const weeklySchedule = {};
    sessions.forEach(session => {
      const dayOfWeek = session.dayOfWeek;
      if (!weeklySchedule[dayOfWeek]) {
        weeklySchedule[dayOfWeek] = [];
      }
      weeklySchedule[dayOfWeek].push(session);
    });

    res.json({
      weekStart: startOfWeek,
      weekEnd: endOfWeek,
      schedule: weeklySchedule,
      totalSessions: sessions.length
    });
  } catch (error) {
    console.error('Weekly timetable error:', error);
    res.status(500).json({ message: 'Failed to fetch weekly timetable' });
  }
});

// Get timetable analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const analytics = await StudySession.aggregate([
      { $match: { user: userId, scheduledDateTime: { $gte: lastWeek } } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalStudyTime: { $sum: '$duration.actual' },
          averageFocus: { $avg: '$performance.focusRating' },
          averageSatisfaction: { $avg: '$performance.satisfactionRating' },
          subjectBreakdown: {
            $push: {
              subject: '$subject',
              duration: '$duration.actual',
              status: '$status'
            }
          }
        }
      }
    ]);

    // Calculate completion rate
    const stats = analytics[0];
    if (stats) {
      stats.completionRate = stats.totalSessions > 0 ? 
        (stats.completedSessions / stats.totalSessions) * 100 : 0;
    }

    res.json({
      analytics: stats || {
        totalSessions: 0,
        completedSessions: 0,
        totalStudyTime: 0,
        averageFocus: 0,
        averageSatisfaction: 0,
        completionRate: 0
      }
    });
  } catch (error) {
    console.error('Timetable analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Delete study session
router.delete('/sessions/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Study session not found' });
    }

    res.json({ message: 'Study session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Failed to delete study session' });
  }
});

module.exports = router;