import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  summary: {
    type: String,
    default: '',
  },
  quiz: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
});

export default mongoose.model('Note', noteSchema);
