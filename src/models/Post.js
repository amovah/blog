import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  minutes: {
    type: Number,
    required: false,
    trim: true
  },
  avatar: {
    type: String,
    trim: true,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewers: [{
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  }],
  likes: [{
    type: String,
    unique: true,
    maxlength: 100
  }]
});

export default mongoose.model('Post', schema);
