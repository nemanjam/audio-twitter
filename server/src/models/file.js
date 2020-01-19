import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
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
});

const File = mongoose.model('File', fileSchema);

export default File;
