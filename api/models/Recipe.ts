import mongoose from 'mongoose';
import { RecipeFields } from '../types';

const Schema = mongoose.Schema;

const RecipeSchema = new Schema<RecipeFields>(
  {
    title: {
      type: String,
      required: [true, 'Введите название блюда'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Введите текст рецепта'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Выберите фото блюда'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
