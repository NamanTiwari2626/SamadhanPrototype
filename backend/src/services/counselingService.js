const OpenAI = require('openai');
const User = require('../models/User');

class CounselingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.assessmentQuestions = [
      {
        id: 'interests',
        question: 'Which activities do you enjoy most?',
        type: 'multiple',
        options: [
          { value: 'problem_solving', label: 'Solving complex problems and puzzles', weight: { engineering: 3, medicine: 2, commerce: 1, arts: 1 } },
          { value: 'helping_people', label: 'Helping and caring for people', weight: { medicine: 3, arts: 2, engineering: 1, commerce: 1 } },
          { value: 'creative_work', label: 'Creative and artistic work', weight: { arts: 3, commerce: 1, engineering: 1, medicine: 1 } },
          { value: 'business', label: 'Business and financial activities', weight: { commerce: 3, engineering: 1, medicine: 1, arts: 1 } },
          { value: 'research', label: 'Research and discovery', weight: { engineering: 2, medicine: 3, arts: 2, commerce: 1 } }
        ]
      },
      {
        id: 'subjects',
        question: 'Which subjects are you strongest in?',
        type: 'multiple',
        options: [
          { value: 'mathematics', label: 'Mathematics', weight: { engineering: 3, commerce: 2, medicine: 1, arts: 1 } },
          { value: 'sciences', label: 'Physics/Chemistry/Biology', weight: { medicine: 3, engineering: 3, commerce: 1, arts: 1 } },
          { value: 'languages', label: 'Languages and Literature', weight: { arts: 3, commerce: 1, engineering: 1, medicine: 1 } },
          { value: 'social_studies', label: 'History/Geography/Economics', weight: { arts: 2, commerce: 3, engineering: 1, medicine: 1 } },
          { value: 'computer', label: 'Computer Science', weight: { engineering: 3, commerce: 2, medicine: 1, arts: 1 } }
        ]
      },
      {
        id: 'work_style',
        question: 'What work environment do you prefer?',
        type: 'single',
        options: [
          { value: 'team_based', label: 'Collaborative team environment', weight: { medicine: 2, commerce: 3, arts: 2, engineering: 1 } },
          { value: 'independent', label: 'Independent work with flexibility', weight: { arts: 3, engineering: 2, medicine: 1, commerce: 1 } },
          { value: 'structured', label: 'Structured and organized setting', weight: { engineering: 2, medicine: 3, commerce: 2, arts: 1 } },
          { value: 'dynamic', label: 'Fast-paced, changing environment', weight: { commerce: 3, arts: 2, engineering: 2, medicine: 1 } }
        ]
      },
      {
        id: 'goals',
        question: 'What motivates you most in your career?',
        type: 'multiple',
        options: [
          { value: 'innovation', label: 'Creating innovative solutions', weight: { engineering: 3, arts: 2, medicine: 2, commerce: 1 } },
          { value: 'helping', label: 'Making a positive impact on society', weight: { medicine: 3, arts: 2, engineering: 2, commerce: 1 } },
          { value: 'success', label: 'Financial success and recognition', weight: { commerce: 3, engineering: 2, medicine: 1, arts: 1 } },
          { value: 'expression', label: 'Self-expression and creativity', weight: { arts: 3, commerce: 1, engineering: 1, medicine: 1 } },
          { value: 'knowledge', label: 'Continuous learning and growth', weight: { medicine: 2, engineering: 2, arts: 2, commerce: 2 } }
        ]
      }
    ];
  }

  async processAssessment(userId, answers) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Calculate scores for each field
      const fieldScores = this.calculateFieldScores(answers);
      
      // Get AI-powered personalized recommendations
      const aiRecommendations = await this.getAIRecommendations(user, answers, fieldScores);
      
      // Update user's counseling data
      user.counselingData.assessmentCompleted = true;
      user.counselingData.careerRecommendations = Object.entries(fieldScores).map(([field, score]) => ({
        field,
        score,
        reasons: this.getFieldReasons(field, answers),
        suggestedCareers: this.getCareerSuggestions(field)
      }));

      // Extract personality insights from AI response
      user.counselingData.personalityType = aiRecommendations.personalityType || 'Analytical';
      user.counselingData.strengths = aiRecommendations.strengths || [];
      user.counselingData.areasForImprovement = aiRecommendations.improvements || [];

      await user.save();
      
      // Award XP for completing assessment
      await user.addXP(50);

      return {
        fieldScores,
        recommendations: user.counselingData.careerRecommendations,
        personalityInsights: {
          type: user.counselingData.personalityType,
          strengths: user.counselingData.strengths,
          improvements: user.counselingData.areasForImprovement
        },
        aiRecommendations: aiRecommendations.detailed || 'Based on your responses, you show strong potential in multiple areas. Focus on developing your core strengths while exploring interdisciplinary opportunities.'
      };

    } catch (error) {
      console.error('Assessment processing error:', error);
      throw new Error('Failed to process career assessment');
    }
  }

  calculateFieldScores(answers) {
    const scores = { engineering: 0, medicine: 0, commerce: 0, arts: 0 };
    
    Object.entries(answers).forEach(([questionId, selectedOptions]) => {
      const question = this.assessmentQuestions.find(q => q.id === questionId);
      if (!question) return;

      const options = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
      
      options.forEach(optionValue => {
        const option = question.options.find(opt => opt.value === optionValue);
        if (option && option.weight) {
          Object.entries(option.weight).forEach(([field, weight]) => {
            scores[field] += weight;
          });
        }
      });
    });

    // Normalize scores to percentages
    const maxScore = Math.max(...Object.values(scores));
    const normalizedScores = {};
    Object.entries(scores).forEach(([field, score]) => {
      normalizedScores[field] = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    });

    return normalizedScores;
  }

  async getAIRecommendations(user, answers, fieldScores) {
    try {
      const prompt = `Analyze this career assessment for a student:

User Profile:
- Name: ${user.fullName}
- Academic Level: ${user.academic.currentLevel}
- Target Exams: ${user.academic.targetExams?.join(', ') || 'General'}

Assessment Results:
- Engineering Score: ${fieldScores.engineering}%
- Medicine Score: ${fieldScores.medicine}%
- Commerce Score: ${fieldScores.commerce}%
- Arts Score: ${fieldScores.arts}%

Assessment Answers: ${JSON.stringify(answers)}

Provide detailed career guidance including:
1. Personality type assessment
2. Top 3 strengths based on responses
3. 2-3 areas for improvement
4. Detailed career recommendations with reasoning
5. Specific next steps for career preparation

Format as JSON with keys: personalityType, strengths, improvements, detailed`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.3
      });

      try {
        return JSON.parse(completion.choices[0].message.content);
      } catch {
        return {
          personalityType: 'Analytical',
          strengths: ['Problem-solving', 'Analytical thinking', 'Dedication'],
          improvements: ['Communication skills', 'Leadership development'],
          detailed: completion.choices[0].message.content
        };
      }
    } catch (error) {
      console.error('AI recommendations error:', error);
      return {
        personalityType: 'Balanced',
        strengths: ['Adaptability', 'Learning ability'],
        improvements: ['Focus area selection'],
        detailed: 'Continue exploring your interests and building foundational skills.'
      };
    }
  }

  getFieldReasons(field, answers) {
    const reasons = {
      engineering: ['Strong in mathematics and problem-solving', 'Enjoys innovative solutions', 'Technical aptitude'],
      medicine: ['Caring nature and desire to help others', 'Strong in sciences', 'Detail-oriented approach'],
      commerce: ['Business acumen and financial interest', 'Leadership qualities', 'Market awareness'],
      arts: ['Creative thinking and expression', 'Communication skills', 'Cultural awareness']
    };

    return reasons[field] || [];
  }

  getCareerSuggestions(field) {
    const careers = {
      engineering: ['Software Engineer', 'Civil Engineer', 'Mechanical Engineer', 'Data Scientist', 'Robotics Engineer'],
      medicine: ['Doctor', 'Surgeon', 'Nurse', 'Medical Researcher', 'Pharmacist', 'Physiotherapist'],
      commerce: ['Business Analyst', 'Financial Advisor', 'Marketing Manager', 'Entrepreneur', 'CA/CFA'],
      arts: ['Graphic Designer', 'Writer', 'Teacher', 'Journalist', 'Psychologist', 'Social Worker']
    };

    return careers[field] || [];
  }

  async getPersonalizedAdvice(userId, careerField) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.counselingData.assessmentCompleted) {
        throw new Error('Assessment not completed');
      }

      const prompt = `Provide personalized career advice for a ${user.academic.currentLevel} student interested in ${careerField}.

Student Profile:
- Current Level: ${user.academic.currentLevel}
- Target Exams: ${user.academic.targetExams?.join(', ')}
- Assessment Scores: ${JSON.stringify(user.counselingData.careerRecommendations)}

Focus on:
1. Specific preparation steps for ${careerField}
2. Subject priorities and study tips
3. Career opportunities and growth paths
4. Skills to develop
5. Timeline and milestones

Keep response concise but actionable.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.4
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Personalized advice error:', error);
      return 'Focus on building strong fundamentals in your chosen field and gaining relevant experience through projects and internships.';
    }
  }
}

module.exports = new CounselingService();