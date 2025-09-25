const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Static syllabus data (in production, this would be from database)
const syllabusData = {
  'jee-main': {
    id: 'jee-main',
    name: 'JEE Main',
    description: 'Joint Entrance Examination for Engineering',
    duration: '3 hours',
    totalSubjects: 3,
    subjects: [
      {
        id: 'mathematics',
        name: 'Mathematics',
        totalTopics: 25,
        topics: [
          {
            id: 'algebra',
            title: 'Algebra',
            description: 'Complex numbers, quadratic equations, sequences and series',
            estimatedTime: 40,
            difficulty: 'medium',
            subtopics: [
              { id: 'complex-numbers', title: 'Complex Numbers', difficulty: 'medium' },
              { id: 'quadratic-equations', title: 'Quadratic Equations', difficulty: 'easy' },
              { id: 'sequences-series', title: 'Sequences and Series', difficulty: 'hard' }
            ]
          },
          {
            id: 'calculus',
            title: 'Calculus',
            description: 'Limits, derivatives, integrals and their applications',
            estimatedTime: 50,
            difficulty: 'hard',
            subtopics: [
              { id: 'limits', title: 'Limits and Continuity', difficulty: 'medium' },
              { id: 'derivatives', title: 'Derivatives', difficulty: 'medium' },
              { id: 'integrals', title: 'Definite and Indefinite Integrals', difficulty: 'hard' }
            ]
          },
          {
            id: 'coordinate-geometry',
            title: 'Coordinate Geometry',
            description: 'Straight lines, circles, parabola, ellipse, hyperbola',
            estimatedTime: 35,
            difficulty: 'medium',
            subtopics: [
              { id: 'straight-lines', title: 'Straight Lines', difficulty: 'easy' },
              { id: 'circles', title: 'Circles', difficulty: 'medium' },
              { id: 'conic-sections', title: 'Conic Sections', difficulty: 'hard' }
            ]
          }
        ]
      },
      {
        id: 'physics',
        name: 'Physics',
        totalTopics: 22,
        topics: [
          {
            id: 'mechanics',
            title: 'Mechanics',
            description: 'Kinematics, laws of motion, work energy and power',
            estimatedTime: 45,
            difficulty: 'medium',
            subtopics: [
              { id: 'kinematics', title: 'Kinematics', difficulty: 'easy' },
              { id: 'laws-of-motion', title: 'Laws of Motion', difficulty: 'medium' },
              { id: 'work-energy', title: 'Work, Energy and Power', difficulty: 'medium' }
            ]
          },
          {
            id: 'thermodynamics',
            title: 'Thermodynamics',
            description: 'Heat, temperature, laws of thermodynamics',
            estimatedTime: 30,
            difficulty: 'hard',
            subtopics: [
              { id: 'heat-temperature', title: 'Heat and Temperature', difficulty: 'easy' },
              { id: 'laws-thermo', title: 'Laws of Thermodynamics', difficulty: 'hard' },
              { id: 'heat-engines', title: 'Heat Engines', difficulty: 'medium' }
            ]
          }
        ]
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        totalTopics: 20,
        topics: [
          {
            id: 'organic-chemistry',
            title: 'Organic Chemistry',
            description: 'Hydrocarbons, functional groups, biomolecules',
            estimatedTime: 50,
            difficulty: 'hard',
            subtopics: [
              { id: 'hydrocarbons', title: 'Hydrocarbons', difficulty: 'medium' },
              { id: 'functional-groups', title: 'Functional Groups', difficulty: 'hard' },
              { id: 'biomolecules', title: 'Biomolecules', difficulty: 'medium' }
            ]
          }
        ]
      }
    ]
  },
  'neet': {
    id: 'neet',
    name: 'NEET',
    description: 'National Eligibility cum Entrance Test for Medical',
    duration: '3 hours',
    totalSubjects: 3,
    subjects: [
      {
        id: 'biology',
        name: 'Biology',
        totalTopics: 30,
        topics: [
          {
            id: 'cell-biology',
            title: 'Cell Biology',
            description: 'Cell structure, cell division, biomolecules',
            estimatedTime: 40,
            difficulty: 'medium',
            subtopics: [
              { id: 'cell-structure', title: 'Cell Structure and Function', difficulty: 'medium' },
              { id: 'cell-division', title: 'Cell Division', difficulty: 'hard' },
              { id: 'biomolecules-bio', title: 'Biomolecules', difficulty: 'medium' }
            ]
          }
        ]
      }
    ]
  }
};

// Get all available exams
router.get('/exams', auth, async (req, res) => {
  try {
    const exams = Object.values(syllabusData).map(exam => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      duration: exam.duration,
      totalSubjects: exam.totalSubjects,
      lastUpdated: '2024-01-15' // Static for now
    }));

    res.json({ exams });
  } catch (error) {
    console.error('Fetch exams error:', error);
    res.status(500).json({ message: 'Failed to fetch exams' });
  }
});

// Get specific exam syllabus
router.get('/exams/:examId', auth, async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = syllabusData[examId];
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam syllabus not found' });
    }

    // Get user progress for this exam
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    // Add completion status to topics (you'd track this in user progress)
    const examWithProgress = {
      ...exam,
      subjects: exam.subjects.map(subject => ({
        ...subject,
        topics: subject.topics.map(topic => ({
          ...topic,
          completed: false, // In real app, check user progress
          subtopics: topic.subtopics ? topic.subtopics.map(sub => ({
            ...sub,
            completed: false // In real app, check user progress
          })) : []
        }))
      }))
    };

    res.json({ exam: examWithProgress });
  } catch (error) {
    console.error('Fetch exam syllabus error:', error);
    res.status(500).json({ message: 'Failed to fetch exam syllabus' });
  }
});

// Mark topic as completed
router.post('/progress/:examId/:subjectId/:topicId', auth, async (req, res) => {
  try {
    const { examId, subjectId, topicId } = req.params;
    const { completed = true, subtopicId } = req.body;

    // In a real application, you'd store this in a UserProgress model
    // For now, we'll simulate success
    
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    // Award XP for topic completion
    if (completed) {
      await user.addXP(25);
    }

    res.json({
      message: completed ? 'Topic marked as completed' : 'Topic marked as incomplete',
      examId,
      subjectId,
      topicId,
      subtopicId,
      completed
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

// Get user's overall syllabus progress
router.get('/progress/overview', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    
    // In a real app, you'd calculate from UserProgress model
    const mockProgress = {
      totalExams: Object.keys(syllabusData).length,
      targetExams: user.academic.targetExams || [],
      overallProgress: {
        'jee-main': {
          totalTopics: 67,
          completedTopics: 23,
          percentage: 34,
          subjects: {
            mathematics: { completed: 8, total: 25, percentage: 32 },
            physics: { completed: 10, total: 22, percentage: 45 },
            chemistry: { completed: 5, total: 20, percentage: 25 }
          }
        },
        'neet': {
          totalTopics: 90,
          completedTopics: 15,
          percentage: 17,
          subjects: {
            biology: { completed: 15, total: 30, percentage: 50 },
            physics: { completed: 0, total: 30, percentage: 0 },
            chemistry: { completed: 0, total: 30, percentage: 0 }
          }
        }
      }
    };

    res.json({ progress: mockProgress });
  } catch (error) {
    console.error('Progress overview error:', error);
    res.status(500).json({ message: 'Failed to fetch progress overview' });
  }
});

// Get recommended topics based on user's weak areas
router.get('/recommendations/:examId', auth, async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = syllabusData[examId];
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // In a real app, you'd analyze user performance and recommend weak topics
    const recommendations = [];
    
    exam.subjects.forEach(subject => {
      subject.topics.slice(0, 2).forEach(topic => {
        recommendations.push({
          examId,
          subjectId: subject.id,
          subjectName: subject.name,
          topicId: topic.id,
          topicTitle: topic.title,
          difficulty: topic.difficulty,
          estimatedTime: topic.estimatedTime,
          reason: 'Based on your recent quiz performance'
        });
      });
    });

    res.json({
      examId,
      recommendations: recommendations.slice(0, 5)
    });
  } catch (error) {
    console.error('Syllabus recommendations error:', error);
    res.status(500).json({ message: 'Failed to fetch recommendations' });
  }
});

// Search topics across all exams
router.get('/search', auth, async (req, res) => {
  try {
    const { query, examId, difficulty } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = [];
    const searchTerm = query.toLowerCase();
    
    Object.values(syllabusData).forEach(exam => {
      if (examId && exam.id !== examId) return;
      
      exam.subjects.forEach(subject => {
        subject.topics.forEach(topic => {
          const matchesQuery = 
            topic.title.toLowerCase().includes(searchTerm) ||
            topic.description.toLowerCase().includes(searchTerm);
          
          const matchesDifficulty = !difficulty || topic.difficulty === difficulty;
          
          if (matchesQuery && matchesDifficulty) {
            results.push({
              examId: exam.id,
              examName: exam.name,
              subjectId: subject.id,
              subjectName: subject.name,
              topicId: topic.id,
              topicTitle: topic.title,
              description: topic.description,
              difficulty: topic.difficulty,
              estimatedTime: topic.estimatedTime
            });
          }
        });
      });
    });

    res.json({
      query,
      results: results.slice(0, 20),
      total: results.length
    });
  } catch (error) {
    console.error('Syllabus search error:', error);
    res.status(500).json({ message: 'Failed to search syllabus' });
  }
});

module.exports = router;