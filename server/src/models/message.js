import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    repostsIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
