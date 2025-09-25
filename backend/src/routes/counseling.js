const express = require('express');
const CounselingService = require('../services/counselingService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get assessment questions
router.get('/assessment/questions', auth, async (req, res) => {
  try {
    res.json({
      questions: CounselingService.assessmentQuestions
    });
  } catch (error) {
    console.error('Assessment questions error:', error);
    res.status(500).json({ message: 'Failed to fetch assessment questions' });
  }
});

// Submit assessment answers
router.post('/assessment/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    const results = await CounselingService.processAssessment(req.user._id, answers);
    
    res.json({
      message: 'Assessment completed successfully',
      results
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({ 
      message: 'Failed to process assessment',
      error: error.message 
    });
  }
});

// Get assessment results
router.get('/assessment/results', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    if (!user || !user.counselingData.assessmentCompleted) {
      return res.status(404).json({ message: 'Assessment not completed' });
    }

    res.json({
      completed: user.counselingData.assessmentCompleted,
      recommendations: user.counselingData.careerRecommendations,
      personalityType: user.counselingData.personalityType,
      strengths: user.counselingData.strengths,
      areasForImprovement: user.counselingData.areasForImprovement
    });
  } catch (error) {
    console.error('Assessment results error:', error);
    res.status(500).json({ message: 'Failed to fetch assessment results' });
  }
});

// Get personalized advice for a specific career field
router.get('/advice/:field', auth, async (req, res) => {
  try {
    const { field } = req.params;
    const validFields = ['engineering', 'medicine', 'commerce', 'arts'];
    
    if (!validFields.includes(field)) {
      return res.status(400).json({ message: 'Invalid career field' });
    }

    const advice = await CounselingService.getPersonalizedAdvice(req.user._id, field);
    
    res.json({
      field,
      advice
    });
  } catch (error) {
    console.error('Personalized advice error:', error);
    res.status(500).json({ 
      message: 'Failed to get personalized advice',
      error: error.message 
    });
  }
});

// Get career recommendations based on current user profile
router.get('/recommendations', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If assessment not completed, provide general recommendations
    if (!user.counselingData.assessmentCompleted) {
      return res.json({
        message: 'Complete the career assessment to get personalized recommendations',
        generalRecommendations: [
          'Explore different career fields through internships',
          'Take career assessment to identify your strengths',
          'Research career paths in your areas of interest',
          'Develop both technical and soft skills',
          'Network with professionals in fields you\'re interested in'
        ]
      });
    }

    res.json({
      recommendations: user.counselingData.careerRecommendations,
      personalityInsights: {
        type: user.counselingData.personalityType,
        strengths: user.counselingData.strengths,
        improvements: user.counselingData.areasForImprovement
      }
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

// Update career preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { targetExams, subjects, institution, graduationYear } = req.body;
    const User = require('../models/User');
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update academic information
    if (targetExams) user.academic.targetExams = targetExams;
    if (subjects) user.academic.subjects = subjects;
    if (institution) user.academic.institution = institution;
    if (graduationYear) user.academic.graduationYear = graduationYear;

    await user.save();

    res.json({
      message: 'Preferences updated successfully',
      academic: user.academic
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});

module.exports = router;