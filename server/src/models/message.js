import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'The filename is necessary'],
    },
    mimetype: {
      type: String,
      required: [true, 'The mimetype is necessary'],
    },
    path: {
      type: String,
      required: [true, 'The path is necessary'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
