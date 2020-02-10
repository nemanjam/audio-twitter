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
    isReposted: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    repost: {
      reposterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      originalMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
      },
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
