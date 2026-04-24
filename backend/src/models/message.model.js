import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'reel_share', 'food_share'],
    default: 'text'
  },
  content: {
    type: String, // Used for text messages
    required: function() {
      return this.messageType === 'text';
    }
  },
  sharedReel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reel',
    required: function() {
      return this.messageType === 'reel_share';
    }
  },
  sharedFood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: function() {
      return this.messageType === 'food_share';
    }
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true });

// Compound index to quickly fetch messages for a specific conversation in reverse chronological order
messageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
