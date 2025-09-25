const OpenAI = require('openai');
const User = require('../models/User');
const StudySession = require('../models/StudySession');
const Question = require('../models/Question');

class MLService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  // Analyze user learning patterns and generate personalized recommendations
  async generatePersonalizedRecommendations(userId) {
    try {
      const user = await User.findById(userId).lean();
      if (!user) throw new Error('User not found');

      // Get recent study session data
      const recentSessions = await StudySession.find({
        user: userId,
        status: 'completed'
      })
      .sort({ scheduledDateTime: -1 })
      .limit(20)
      .lean();

      // Analyze learning patterns
      const learningPattern = this.analyzeLearningPatterns(user, recentSessions);
      
      // Generate AI-powered recommendations
      const aiRecommendations = await this.getAIRecommendations(user, learningPattern);
      
      return {
        learningPattern,
        recommendations: aiRecommendations,
        generatedAt: Date.now()
      };

    } catch (error) {
      console.error('ML recommendations error:', error);
      throw new Error('Failed to generate personalized recommendations');
    }
  }

  analyzeLearningPatterns(user, sessions) {
    const patterns = {
      studyHabits: {},
      subjectPreferences: {},
      timePreferences: {},
      difficultyPreferences: {},
      strengths: [],
      weaknesses: []
    };

    if (sessions.length === 0) {
      return {
        ...patterns,
        confidence: 0,
        message: 'Not enough data to analyze patterns'
      };
    }

    // Analyze study habits
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const avgFocus = sessions.reduce((sum, s) => sum + (s.performance?.focusRating || 0), 0) / totalSessions;
    
    patterns.studyHabits = {
      completionRate: (completedSessions / totalSessions) * 100,
      averageFocus: avgFocus,
      consistency: this.calculateConsistency(sessions),
      preferredSessionLength: this.calculatePreferredDuration(sessions)
    };

    // Analyze subject preferences
    const subjectTime = {};
    const subjectPerformance = {};
    
    sessions.forEach(session => {
      const subject = session.subject;
      subjectTime[subject] = (subjectTime[subject] || 0) + session.duration.actual;
      
      if (session.performance?.satisfactionRating) {
        if (!subjectPerformance[subject]) {
          subjectPerformance[subject] = [];
        }
        subjectPerformance[subject].push(session.performance.satisfactionRating);
      }
    });

    patterns.subjectPreferences = Object.keys(subjectTime).map(subject => ({
      subject,
      timeSpent: subjectTime[subject],
      averageSatisfaction: subjectPerformance[subject] ? 
        subjectPerformance[subject].reduce((sum, rating) => sum + rating, 0) / subjectPerformance[subject].length : 0
    })).sort((a, b) => b.timeSpent - a.timeSpent);

    // Identify strengths and weaknesses
    patterns.strengths = this.identifyStrengths(user, sessions);
    patterns.weaknesses = this.identifyWeaknesses(user, sessions);

    return {
      ...patterns,
      confidence: Math.min(sessions.length / 10, 1), // Max confidence at 10+ sessions
      analysisDate: Date.now()
    };
  }

  calculateConsistency(sessions) {
    if (sessions.length < 7) return 0;

    const dates = sessions.map(s => new Date(s.scheduledDateTime).toDateString());
    const uniqueDates = new Set(dates);
    const daySpan = 14; // Look at last 14 days
    
    return (uniqueDates.size / daySpan) * 100;
  }

  calculatePreferredDuration(sessions) {
    const durations = sessions.map(s => s.duration.actual).filter(d => d > 0);
    if (durations.length === 0) return 30; // Default 30 minutes
    
    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  identifyStrengths(user, sessions) {
    const strengths = [];
    
    // High focus sessions
    const highFocusSessions = sessions.filter(s => s.performance?.focusRating >= 4);
    if (highFocusSessions.length / sessions.length > 0.6) {
      strengths.push('Excellent focus and concentration');
    }

    // Consistency
    const consistency = this.calculateConsistency(sessions);
    if (consistency > 70) {
      strengths.push('Consistent study schedule');
    }

    // Subject mastery (mock - would analyze actual performance data)
    if (user.stats.questionsAnswered > 100) {
      strengths.push('Strong problem-solving practice');
    }

    return strengths;
  }

  identifyWeaknesses(user, sessions) {
    const weaknesses = [];
    
    // Low focus
    const avgFocus = sessions.reduce((sum, s) => sum + (s.performance?.focusRating || 0), 0) / sessions.length;
    if (avgFocus < 3) {
      weaknesses.push('Focus and concentration need improvement');
    }

    // Inconsistency
    const consistency = this.calculateConsistency(sessions);
    if (consistency < 40) {
      weaknesses.push('Irregular study schedule');
    }

    // Subject imbalance
    const subjectCounts = {};
    sessions.forEach(s => {
      subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1;
    });
    
    const subjects = Object.keys(subjectCounts);
    if (subjects.length > 1) {
      const maxCount = Math.max(...Object.values(subjectCounts));
      const dominantSubject = subjects.find(s => subjectCounts[s] === maxCount);
      if (maxCount / sessions.length > 0.7) {
        weaknesses.push(`Over-focusing on ${dominantSubject} - need more subject balance`);
      }
    }

    return weaknesses;
  }

  async getAIRecommendations(user, learningPattern) {
    try {
      const prompt = `Analyze this student's learning data and provide personalized study recommendations:

Student Profile:
- Academic Level: ${user.academic.currentLevel}
- Target Exams: ${user.academic.targetExams?.join(', ') || 'General'}
- Current Level: ${user.stats.level}
- Study Goals: ${user.preferences.studyHours}hrs/day

Learning Pattern Analysis:
- Completion Rate: ${learningPattern.studyHabits.completionRate}%
- Average Focus: ${learningPattern.studyHabits.averageFocus}/5
- Consistency: ${learningPattern.studyHabits.consistency}%
- Strengths: ${learningPattern.strengths.join(', ')}
- Weaknesses: ${learningPattern.weaknesses.join(', ')}

Top Subjects: ${learningPattern.subjectPreferences.slice(0, 3).map(s => s.subject).join(', ')}

Provide specific, actionable recommendations in these categories:
1. Study Schedule Optimization
2. Subject Focus Areas
3. Learning Techniques
4. Motivation & Habits
5. Next Steps

Format as JSON with categories as keys and array of recommendations as values.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-5', // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        response_format: { type: "json_object" }
      });

      try {
        return JSON.parse(completion.choices[0].message.content);
      } catch {
        return this.getFallbackRecommendations(learningPattern);
      }

    } catch (error) {
      console.error('AI recommendations error:', error);
      return this.getFallbackRecommendations(learningPattern);
    }
  }

  getFallbackRecommendations(learningPattern) {
    const recommendations = {
      'Study Schedule Optimization': [],
      'Subject Focus Areas': [],
      'Learning Techniques': [],
      'Motivation & Habits': [],
      'Next Steps': []
    };

    // Generate basic recommendations based on patterns
    if (learningPattern.studyHabits.consistency < 50) {
      recommendations['Study Schedule Optimization'].push(
        'Establish a consistent daily study routine at the same time each day'
      );
      recommendations['Motivation & Habits'].push(
        'Start with small 15-minute study sessions to build the habit'
      );
    }

    if (learningPattern.studyHabits.averageFocus < 3) {
      recommendations['Learning Techniques'].push(
        'Try the Pomodoro Technique: 25 minutes focused study + 5 minute breaks'
      );
      recommendations['Learning Techniques'].push(
        'Eliminate distractions: put phone in another room, use website blockers'
      );
    }

    if (learningPattern.subjectPreferences.length > 0) {
      const topSubject = learningPattern.subjectPreferences[0].subject;
      recommendations['Subject Focus Areas'].push(
        `Continue excelling in ${topSubject} while balancing time with other subjects`
      );
    }

    recommendations['Next Steps'].push(
      'Set weekly study goals and track your progress daily'
    );
    recommendations['Next Steps'].push(
      'Take practice quizzes to identify knowledge gaps'
    );

    return recommendations;
  }

  // Analyze question difficulty and suggest optimal difficulty progression
  async analyzeQuestionDifficulty(userId, subject) {
    try {
      // This would analyze user's answer patterns to recommend optimal difficulty
      const user = await User.findById(userId).lean();
      
      // Mock difficulty analysis - in real implementation, analyze answer patterns
      const currentLevel = user.preferences.difficultyLevel || 'intermediate';
      const difficultyMap = {
        beginner: ['easy', 'easy', 'medium'],
        intermediate: ['easy', 'medium', 'medium', 'hard'],
        advanced: ['medium', 'hard', 'hard']
      };

      return {
        currentLevel,
        recommendedDifficulties: difficultyMap[currentLevel],
        progressionSuggestion: 'Gradually increase difficulty as accuracy improves',
        targetAccuracy: 75
      };

    } catch (error) {
      console.error('Question difficulty analysis error:', error);
      return {
        currentLevel: 'intermediate',
        recommendedDifficulties: ['easy', 'medium', 'hard'],
        progressionSuggestion: 'Balance between different difficulty levels'
      };
    }
  }

  // Predict optimal study schedule based on user patterns
  async predictOptimalSchedule(userId) {
    try {
      const sessions = await StudySession.find({
        user: userId,
        status: 'completed'
      })
      .sort({ scheduledDateTime: -1 })
      .limit(30)
      .lean();

      if (sessions.length < 5) {
        return this.getDefaultSchedule();
      }

      // Analyze time patterns
      const timeAnalysis = this.analyzeTimePatterns(sessions);
      
      // Generate optimized schedule
      const optimizedSchedule = this.generateOptimizedSchedule(timeAnalysis);

      return {
        optimizedSchedule,
        reasoning: timeAnalysis.insights,
        confidence: Math.min(sessions.length / 20, 1)
      };

    } catch (error) {
      console.error('Schedule prediction error:', error);
      return this.getDefaultSchedule();
    }
  }

  analyzeTimePatterns(sessions) {
    const hourPerformance = {};
    const dayPerformance = {};

    sessions.forEach(session => {
      const hour = new Date(session.scheduledDateTime).getHours();
      const day = new Date(session.scheduledDateTime).getDay();
      
      if (!hourPerformance[hour]) {
        hourPerformance[hour] = { focus: [], satisfaction: [] };
      }
      if (!dayPerformance[day]) {
        dayPerformance[day] = { focus: [], satisfaction: [] };
      }

      if (session.performance?.focusRating) {
        hourPerformance[hour].focus.push(session.performance.focusRating);
        dayPerformance[day].focus.push(session.performance.focusRating);
      }
      if (session.performance?.satisfactionRating) {
        hourPerformance[hour].satisfaction.push(session.performance.satisfactionRating);
        dayPerformance[day].satisfaction.push(session.performance.satisfactionRating);
      }
    });

    // Find optimal times
    const bestHours = Object.keys(hourPerformance)
      .map(hour => ({
        hour: parseInt(hour),
        avgFocus: hourPerformance[hour].focus.reduce((sum, f) => sum + f, 0) / hourPerformance[hour].focus.length || 0
      }))
      .sort((a, b) => b.avgFocus - a.avgFocus)
      .slice(0, 3);

    return {
      bestHours,
      insights: [`Best performance typically between ${bestHours[0]?.hour}:00-${bestHours[0]?.hour + 1}:00`]
    };
  }

  generateOptimizedSchedule(timeAnalysis) {
    const schedule = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach((day, index) => {
      schedule[day] = [];
      
      // Suggest sessions during best performing hours
      timeAnalysis.bestHours.slice(0, 2).forEach((timeSlot, slotIndex) => {
        schedule[day].push({
          startTime: `${timeSlot.hour}:00`,
          duration: 45,
          subject: slotIndex === 0 ? 'Primary focus subject' : 'Secondary subject',
          type: 'focused_study'
        });
      });
    });

    return schedule;
  }

  getDefaultSchedule() {
    return {
      optimizedSchedule: {
        'Monday': [{ startTime: '09:00', duration: 45, subject: 'Mathematics', type: 'focused_study' }],
        'Tuesday': [{ startTime: '09:00', duration: 45, subject: 'Physics', type: 'focused_study' }],
        'Wednesday': [{ startTime: '09:00', duration: 45, subject: 'Chemistry', type: 'focused_study' }],
        'Thursday': [{ startTime: '09:00', duration: 45, subject: 'Mathematics', type: 'focused_study' }],
        'Friday': [{ startTime: '09:00', duration: 45, subject: 'Physics', type: 'focused_study' }],
        'Saturday': [{ startTime: '10:00', duration: 60, subject: 'Review', type: 'review' }],
        'Sunday': [{ startTime: '10:00', duration: 30, subject: 'Planning', type: 'planning' }]
      },
      reasoning: ['Default schedule based on common study patterns'],
      confidence: 0.3
    };
  }
}

module.exports = new MLService();