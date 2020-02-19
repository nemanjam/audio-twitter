import mongoose from 'mongoose';

const seedSchema = new mongoose.Schema(
  {
    seed: {
      type: String,
      default: 'seed',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Seed = mongoose.model('Seed', seedSchema);

export default Seed;
