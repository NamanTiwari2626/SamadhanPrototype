const express = require('express');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get questions with filters and search
router.get('/', auth, async (req, res) => {
  try {
    const { 
      subject, 
      difficulty, 
      topic,
      examType,
      page = 1, 
      limit = 20,
      search,
      sortBy = 'createdAt'
    } = req.query;

    const filter = { isActive: true };
    
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = new RegExp(topic, 'i');
    if (examType) filter.examType = examType;
    
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortBy === 'popularity' ? -1 : -1;

    const questions = await Question.find(filter)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Question.countDocuments(filter);

    // Don't send correct answers to prevent cheating
    const questionsForClient = questions.map(q => ({
      ...q,
      options: q.options.map(opt => ({ text: opt.text })),
      // Remove solution details in list view
      solution: undefined
    }));

    res.json({
      questions: questionsForClient,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Fetch questions error:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Get frequently attempted questions
router.get('/frequent', auth, async (req, res) => {
  try {
    const { subject, limit = 10 } = req.query;
    const filter = { 
      isActive: true,
      'statistics.totalAttempts': { $gt: 0 }
    };
    
    if (subject) filter.subject = subject;

    const frequentQuestions = await Question.find(filter)
      .sort({ 'statistics.totalAttempts': -1 })
      .limit(parseInt(limit))
      .select('-solution -options.isCorrect')
      .lean();

    res.json({ questions: frequentQuestions });
  } catch (error) {
    console.error('Frequent questions error:', error);
    res.status(500).json({ message: 'Failed to fetch frequent questions' });
  }
});

// Get question by ID (for practice/quiz)
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Return question without revealing correct answer initially
    const questionForPractice = {
      ...question.toObject(),
      options: question.options.map(opt => ({ text: opt.text }))
    };

    res.json({ question: questionForPractice });
  } catch (error) {
    console.error('Fetch question error:', error);
    res.status(500).json({ message: 'Failed to fetch question' });
  }
});

// Submit answer and get detailed feedback
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { selectedOption, timeSpent = 0 } = req.body;
    
    const question = await Question.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const correctOption = question.options.findIndex(opt => opt.isCorrect);
    const isCorrect = selectedOption === correctOption;

    // Update question statistics
    question.statistics.totalAttempts += 1;
    if (isCorrect) {
      question.statistics.correctAttempts += 1;
    }
    
    // Update average time
    const currentAvgTime = question.statistics.averageTime || 0;
    const totalAttempts = question.statistics.totalAttempts;
    question.statistics.averageTime = 
      ((currentAvgTime * (totalAttempts - 1)) + timeSpent) / totalAttempts;

    await question.save();

    // Update user statistics
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    user.stats.questionsAnswered += 1;
    
    // Award XP based on correctness and difficulty
    let xpGained = 2; // Base XP
    if (isCorrect) {
      xpGained += question.difficulty === 'hard' ? 8 : 
                  question.difficulty === 'medium' ? 5 : 3;
    }
    
    await user.addXP(xpGained);

    // Return detailed feedback
    res.json({
      isCorrect,
      correctOption,
      selectedOption,
      explanation: question.explanation,
      solution: question.solution,
      difficulty: question.difficulty,
      xpGained,
      accuracyRate: Math.round((question.statistics.correctAttempts / question.statistics.totalAttempts) * 100)
    });

  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ message: 'Failed to submit answer' });
  }
});

// Get questions by topic with detailed breakdown
router.get('/by-topic/:subject', auth, async (req, res) => {
  try {
    const { subject } = req.params;
    
    const topicBreakdown = await Question.aggregate([
      { $match: { subject: subject, isActive: true } },
      {
        $group: {
          _id: '$topic',
          totalQuestions: { $sum: 1 },
          easyQuestions: { $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] } },
          mediumQuestions: { $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] } },
          hardQuestions: { $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] } },
          averageAccuracy: { $avg: {
            $cond: [
              { $gt: ['$statistics.totalAttempts', 0] },
              { $multiply: [
                { $divide: ['$statistics.correctAttempts', '$statistics.totalAttempts'] },
                100
              ]},
              0
            ]
          }},
          totalAttempts: { $sum: '$statistics.totalAttempts' }
        }
      },
      { $sort: { totalQuestions: -1 } }
    ]);

    res.json({
      subject,
      topics: topicBreakdown.map(topic => ({
        name: topic._id,
        totalQuestions: topic.totalQuestions,
        difficulty: {
          easy: topic.easyQuestions,
          medium: topic.mediumQuestions,
          hard: topic.hardQuestions
        },
        averageAccuracy: Math.round(topic.averageAccuracy),
        popularity: topic.totalAttempts
      }))
    });
  } catch (error) {
    console.error('Topic breakdown error:', error);
    res.status(500).json({ message: 'Failed to fetch topic breakdown' });
  }
});

// Get personalized question recommendations
router.get('/recommendations/for-me', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    const userSubjects = user.academic.subjects || [];
    const userLevel = user.preferences.difficultyLevel || 'intermediate';
    
    // Map user difficulty preference to question difficulty
    const difficultyMap = {
      beginner: 'easy',
      intermediate: 'medium',
      advanced: 'hard'
    };

    const targetDifficulty = difficultyMap[userLevel];

    const recommendations = await Question.find({
      isActive: true,
      subject: { $in: userSubjects },
      difficulty: { $in: [targetDifficulty, 'medium'] }, // Include medium as fallback
      'statistics.totalAttempts': { $lt: 1000 } // Avoid over-practiced questions
    })
    .sort({ 'statistics.totalAttempts': 1, createdAt: -1 })
    .limit(10)
    .select('-solution -options.isCorrect')
    .lean();

    res.json({
      recommendations,
      criteria: {
        subjects: userSubjects,
        difficulty: targetDifficulty,
        reason: 'Based on your academic profile and difficulty preference'
      }
    });

  } catch (error) {
    console.error('Question recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

// Report a question for review
router.post('/:id/report', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.metadata.reportCount += 1;
    await question.save();

    // In a real app, you'd create a separate Report model
    res.json({ message: 'Question reported for review' });
  } catch (error) {
    console.error('Report question error:', error);
    res.status(500).json({ message: 'Failed to report question' });
  }
});

module.exports = router;