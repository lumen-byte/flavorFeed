import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

// Ensure participants array is exactly length 2
conversationSchema.path('participants').validate(function (value) {
  return value.length === 2;
}, 'A conversation must have exactly two participants.');

export default mongoose.model('Conversation', conversationSchema);
