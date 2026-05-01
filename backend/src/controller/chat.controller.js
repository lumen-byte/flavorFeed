import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'fullName email') // Fetch name and email, we don't have avatar field in user yet, assuming we just need names
      .populate({
        path: 'lastMessage',
        select: 'content messageType sender createdAt seenBy'
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const createOrGetConversation = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    if (userId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: "Cannot create conversation with yourself" });
    }

    // Check if user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, targetUserId] }
    }).populate('participants', 'fullName email').populate('lastMessage');

    if (!conversation) {
      // Create new
      conversation = await Conversation.create({
        participants: [userId, targetUserId]
      });
      conversation = await conversation.populate('participants', 'fullName email');
    }

    res.status(200).json(conversation);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { cursor, limit = 20 } = req.query; // Cursor is the timestamp or ID of the oldest message currently loaded
    const userId = req.user._id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    let query = { conversationId };

    if (cursor) {
      // Fetch messages older than the cursor
      query.createdAt = { $lt: new Date(cursor) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('sender', 'fullName')
      .populate('sharedReel')
      .populate('sharedFood');

    // Return in chronological order
    res.status(200).json(messages.reverse());
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { messageType = 'text', content, sharedReel, sharedFood } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (messageType === 'text' && !content) {
      return res.status(400).json({ message: "Text content is required" });
    }
    if (messageType === 'reel_share' && !sharedReel) {
      return res.status(400).json({ message: "sharedReel is required" });
    }
    if (messageType === 'food_share' && !sharedFood) {
      return res.status(400).json({ message: "sharedFood is required" });
    }

    const messageData = {
      conversationId,
      sender: userId,
      messageType,
      seenBy: [userId] // Sender has implicitly seen it
    };

    if (messageType === 'text') messageData.content = content;
    if (messageType === 'reel_share') messageData.sharedReel = sharedReel;
    if (messageType === 'food_share') messageData.sharedFood = sharedFood;

    let newMessage = await Message.create(messageData);

    newMessage = await newMessage.populate('sender', 'fullName');
    if (messageType === 'reel_share') newMessage = await newMessage.populate('sharedReel');
    if (messageType === 'food_share') newMessage = await newMessage.populate('sharedFood');

    // Update conversation lastMessage
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
