const express = require('express');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all quizzes with filters
router.get('/', auth, async (req, res) => {
  try {
    const { 
      subject, 
      difficulty, 
      examType, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    const filter = { isActive: true };
    
    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (examType) filter.examType = examType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const quizzes = await Quiz.find(filter)
      .populate('questions', 'subject topic difficulty')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Quiz.countDocuments(filter);

    res.json({
      quizzes,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
});

// Get quiz by ID with questions
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Increment total attempts (analytics)
    quiz.statistics.totalAttempts += 1;
    await quiz.save();

    res.json(quiz);
  } catch (error) {
    console.error('Fetch quiz error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz' });
  }
});

// Submit quiz answers and get results
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body; // answers: { questionId: selectedOption }
    
    const quiz = await Quiz.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('questions');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let correctAnswers = 0;
    const results = [];

    // Calculate score and detailed results
    for (const question of quiz.questions) {
      const userAnswer = answers[question._id.toString()];
      const correctOption = question.options.findIndex(opt => opt.isCorrect);
      const isCorrect = userAnswer === correctOption;

      if (isCorrect) {
        correctAnswers++;
        score += 1;
      }

      results.push({
        questionId: question._id,
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: correctOption,
        isCorrect,
        explanation: question.explanation,
        options: question.options
      });

      // Update question statistics
      question.statistics.totalAttempts += 1;
      if (isCorrect) {
        question.statistics.correctAttempts += 1;
      }
      await question.save();
    }

    const percentage = Math.round((score / quiz.totalQuestions) * 100);
    const passed = percentage >= quiz.settings.passingScore;

    // Update quiz statistics
    quiz.statistics.averageScore = 
      ((quiz.statistics.averageScore * quiz.statistics.totalAttempts) + percentage) / 
      (quiz.statistics.totalAttempts + 1);
    quiz.statistics.averageTime = 
      ((quiz.statistics.averageTime * quiz.statistics.totalAttempts) + timeSpent) / 
      (quiz.statistics.totalAttempts + 1);
    if (passed) {
      quiz.statistics.completionRate = 
        ((quiz.statistics.completionRate * quiz.statistics.totalAttempts) + 100) / 
        (quiz.statistics.totalAttempts + 1);
    }

    await quiz.save();

    // Update user statistics
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    user.stats.quizzesCompleted += 1;
    user.stats.questionsAnswered += quiz.totalQuestions;

    // Award XP based on performance
    let xpGained = 10; // Base XP for completing quiz
    xpGained += Math.floor(percentage / 10) * 5; // Bonus for good performance
    if (passed) xpGained += 20; // Bonus for passing

    await user.addXP(xpGained);

    const quizResult = {
      quizId: quiz._id,
      quizTitle: quiz.title,
      score: percentage,
      correctAnswers,
      totalQuestions: quiz.totalQuestions,
      timeSpent,
      passed,
      xpGained,
      results,
      passingScore: quiz.settings.passingScore
    };

    res.json({
      message: 'Quiz submitted successfully',
      result: quizResult
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
});

// Get quiz statistics (for instructors/admin)
router.get('/:id/stats', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ 
      _id: req.params.id, 
      isActive: true 
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      statistics: quiz.statistics,
      settings: quiz.settings
    });
  } catch (error) {
    console.error('Quiz stats error:', error);
    res.status(500).json({ message: 'Failed to fetch quiz statistics' });
  }
});

// Get recommended quizzes based on user performance
router.get('/recommendations/for-me', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    // Get subjects user is weak in or interested in
    const userSubjects = user.academic.subjects || [];
    const userLevel = user.academic.currentLevel || 'high_school';
    
    const filter = {
      isActive: true,
      $or: [
        { subject: { $in: userSubjects } },
        { examType: { $in: user.academic.targetExams || [] } }
      ]
    };

    const recommendations = await Quiz.find(filter)
      .sort({ 'statistics.averageScore': 1, createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      recommendations,
      reason: 'Based on your academic profile and subjects of interest'
    });

  } catch (error) {
    console.error('Quiz recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

module.exports = router;