import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import type { Recipe, RecipeFull } from '../../interfaces';

export const fetchRecipes = createAsyncThunk<Recipe[], string | undefined>(
  'recipes/fetch',
  async (authorId) => {
    const { data: recipes } = await axiosApi.get<Recipe[]>('/recipes', {
      params: authorId ? { author: authorId } : undefined,
    });
    return recipes;
  },
);

export const fetchOneRecipe = createAsyncThunk<RecipeFull, string>(
  'recipes/fetchOne',
  async (id) => {
    const { data: recipe } = await axiosApi.get<RecipeFull>(`/recipes/${id}`);
    return recipe;
  },
);
