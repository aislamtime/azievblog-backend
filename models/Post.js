import mongoose from 'mongoose'

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
      unique: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    avatarUrl: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Post', PostSchema)
