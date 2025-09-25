const OpenAI = require('openai');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

class ChatService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async processMessage(userId, message, files = [], context = {}) {
    try {
      // Get user context for personalization
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      // Build conversation context
      const recentMessages = await ChatMessage.find({ 
        user: userId 
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

      const conversationHistory = recentMessages.reverse().map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      // Create system prompt based on user profile and context
      const systemPrompt = this.createSystemPrompt(user, context);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const startTime = Date.now();
      
      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const responseTime = Date.now() - startTime;
      const aiResponse = completion.choices[0].message.content;

      // Save user message
      const userMessage = new ChatMessage({
        user: userId,
        message: message,
        sender: 'user',
        context: context,
        files: files
      });
      await userMessage.save();

      // Save AI response
      const aiMessage = new ChatMessage({
        user: userId,
        message: aiResponse,
        sender: 'ai',
        context: context,
        aiResponse: {
          model: completion.model,
          tokens: {
            prompt: completion.usage.prompt_tokens,
            completion: completion.usage.completion_tokens,
            total: completion.usage.total_tokens
          },
          responseTime: responseTime,
          confidence: 0.9 // Could implement confidence scoring
        }
      });
      await aiMessage.save();

      // Update user activity and stats
      await user.updateActivity();
      await user.addXP(5); // Small XP for chat interaction

      return {
        response: aiResponse,
        messageId: aiMessage._id,
        tokens: completion.usage.total_tokens,
        responseTime: responseTime
      };

    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  createSystemPrompt(user, context) {
    const basePrompt = `You are VinshAI, an intelligent study assistant designed to help students excel in their academic journey. You are knowledgeable, encouraging, and focused on education.

User Profile:
- Name: ${user.fullName}
- Academic Level: ${user.academic.currentLevel}
- Target Exams: ${user.academic.targetExams?.join(', ') || 'General'}
- Study Hours: ${user.preferences.studyHours}hrs/day
- Current Level: ${user.stats.level} (XP: ${user.stats.xp})
- Subjects: ${user.academic.subjects?.join(', ') || 'Various'}

Key Responsibilities:
1. Answer academic questions with clear, step-by-step explanations
2. Provide study tips and learning strategies
3. Help with exam preparation and time management
4. Offer motivation and support during challenging times
5. Suggest personalized study plans and resources
6. Clarify doubts in mathematics, physics, chemistry, biology, and other subjects

Guidelines:
- Always be encouraging and positive
- Provide detailed explanations with examples
- Suggest follow-up questions or related topics
- Keep responses educational and relevant
- Use simple language while being thorough
- Reference the user's academic goals and preferences`;

    // Add context-specific information
    if (context.subject) {
      return basePrompt + `\n\nCurrent Context: The user is asking about ${context.subject}`;
    }

    if (context.topic) {
      return basePrompt + `\n\nCurrent Context: Discussing ${context.topic}`;
    }

    return basePrompt;
  }

  async getChatHistory(userId, limit = 50) {
    try {
      const messages = await ChatMessage.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return messages.reverse().map(msg => ({
        id: msg._id,
        text: msg.message,
        sender: msg.sender,
        timestamp: msg.createdAt,
        files: msg.files || []
      }));
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  async provideFeedback(messageId, userId, rating, comment) {
    try {
      const message = await ChatMessage.findOne({ 
        _id: messageId, 
        user: userId 
      });
      
      if (!message) {
        throw new Error('Message not found');
      }

      message.feedback = {
        rating: rating,
        comment: comment,
        category: 'helpfulness'
      };

      await message.save();
      return true;
    } catch (error) {
      console.error('Error saving feedback:', error);
      return false;
    }
  }
}

module.exports = new ChatService();