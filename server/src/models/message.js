import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    filename: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    path: {
      type: String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
