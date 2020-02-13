import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    // kome izlazi notifikacija
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ko mu je dao notifikaciju
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
