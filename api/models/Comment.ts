import mongoose from 'mongoose';
import { CommentFields } from '../types';

const Schema = mongoose.Schema;

const CommentSchema = new Schema<CommentFields>(
  {
    text: {
      type: String,
      required: [true, 'Введите текст комментария'],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Не указан рецепт'],
    },
  },
  { timestamps: true },
);

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
