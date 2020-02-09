import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model(
  'Notification',
  notificationSchema,
);

export default Notification;
