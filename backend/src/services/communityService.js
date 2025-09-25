const CommunityMessage = require('../models/CommunityMessage');
const User = require('../models/User');

class CommunityService {
  joinCommunity(socket, data) {
    const { channel = 'general' } = data;
    
    // Join the channel room
    socket.join(`channel_${channel}`);
    
    // Broadcast user joined to channel
    socket.to(`channel_${channel}`).emit('user_joined', {
      userId: socket.user._id,
      username: socket.user.fullName,
      channel: channel,
      timestamp: Date.now()
    });

    console.log(`User ${socket.user._id} joined channel: ${channel}`);
  }

  async handleMessage(socket, data) {
    try {
      const { content, channel = 'general', messageType = 'message' } = data;

      if (!content || content.trim().length === 0) {
        socket.emit('message_error', { error: 'Message cannot be empty' });
        return;
      }

      // Create and save message
      const message = new CommunityMessage({
        author: socket.user._id,
        content: {
          text: content.trim()
        },
        channel: channel,
        messageType: messageType
      });

      await message.save();

      // Populate author information
      await message.populate('author', 'profile.firstName profile.lastName profile.avatar');

      // Broadcast message to all users in the channel
      const messageData = {
        id: message._id,
        author: {
          id: message.author._id,
          name: message.author.fullName,
          avatar: message.author.profile.avatar
        },
        content: message.content.text,
        channel: message.channel,
        timestamp: message.createdAt,
        reactions: message.reactions,
        replies: message.replies
      };

      socket.to(`channel_${channel}`).emit('new_message', messageData);
      socket.emit('message_sent', messageData);

      // Award XP for community participation
      await socket.user.addXP(2);

    } catch (error) {
      console.error('Community message error:', error);
      socket.emit('message_error', { 
        error: 'Failed to send message' 
      });
    }
  }

  async getChannelMessages(channel, limit = 50, offset = 0) {
    try {
      const messages = await CommunityMessage.find({ 
        channel: channel,
        status: 'active'
      })
      .populate('author', 'profile.firstName profile.lastName profile.avatar')
      .populate('replies.author', 'profile.firstName profile.lastName profile.avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

      return messages.reverse().map(msg => ({
        id: msg._id,
        author: {
          id: msg.author._id,
          name: `${msg.author.profile.firstName} ${msg.author.profile.lastName}`,
          avatar: msg.author.profile.avatar
        },
        content: msg.content.text,
        channel: msg.channel,
        timestamp: msg.createdAt,
        reactions: msg.reactions,
        replies: msg.replies.map(reply => ({
          id: reply._id,
          author: {
            id: reply.author._id,
            name: `${reply.author.profile.firstName} ${reply.author.profile.lastName}`,
            avatar: reply.author.profile.avatar
          },
          content: reply.content,
          timestamp: reply.timestamp,
          reactions: reply.reactions
        })),
        isPinned: msg.isPinned,
        isSticky: msg.isSticky
      }));
    } catch (error) {
      console.error('Error fetching channel messages:', error);
      return [];
    }
  }

  async addReaction(messageId, userId, emoji) {
    try {
      const message = await CommunityMessage.findById(messageId);
      if (!message) return false;

      // Check if user already reacted with this emoji
      const existingReaction = message.reactions.find(
        reaction => reaction.user.toString() === userId && reaction.emoji === emoji
      );

      if (existingReaction) {
        // Remove reaction
        message.reactions = message.reactions.filter(
          reaction => !(reaction.user.toString() === userId && reaction.emoji === emoji)
        );
      } else {
        // Add reaction
        message.reactions.push({
          user: userId,
          emoji: emoji,
          timestamp: Date.now()
        });
      }

      await message.save();
      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  }

  async reportMessage(messageId, userId, reason) {
    try {
      const message = await CommunityMessage.findById(messageId);
      if (!message) return false;

      message.moderation.flaggedBy.push({
        user: userId,
        reason: reason,
        timestamp: Date.now()
      });

      message.moderation.isFlagged = true;
      await message.save();

      return true;
    } catch (error) {
      console.error('Error reporting message:', error);
      return false;
    }
  }

  async getChannelStats(channel) {
    try {
      const stats = await CommunityMessage.aggregate([
        { $match: { channel: channel, status: 'active' } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            totalReactions: { $sum: { $size: '$reactions' } },
            totalReplies: { $sum: { $size: '$replies' } },
            activeUsers: { $addToSet: '$author' },
            averageEngagement: { $avg: '$engagement.views' }
          }
        }
      ]);

      return stats[0] || {
        totalMessages: 0,
        totalReactions: 0,
        totalReplies: 0,
        activeUsers: [],
        averageEngagement: 0
      };
    } catch (error) {
      console.error('Error getting channel stats:', error);
      return null;
    }
  }
}

module.exports = new CommunityService();