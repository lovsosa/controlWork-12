import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import axiosApi from '../../axiosApi';
import type {
  Author,
  GlobalError,
  Recipe,
  RecipeFull,
  RecipeMutation,
  ValidationError,
} from '../../interfaces';
import type { RootState } from '../../app/store';

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

export const fetchAuthor = createAsyncThunk<Author, string>(
  'recipes/fetchAuthor',
  async (id) => {
    const { data: author } = await axiosApi.get<Author>(`/users/${id}`);
    return author;
  },
);

export const createRecipe = createAsyncThunk<
  void,
  RecipeMutation,
  { state: RootState; rejectValue: ValidationError | GlobalError }
>('recipes/create', async (mutation, { getState, rejectWithValue }) => {
  const token = getState().users.user?.token;

  const formData = new FormData();
  formData.append('title', mutation.title);
  formData.append('description', mutation.description);
  if (mutation.image) {
    formData.append('image', mutation.image);
  }

  try {
    await axiosApi.post('/recipes', formData, {
      headers: { Authorization: token },
    });
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      (error.response.status === 400 || error.response.status === 401)
    ) {
      return rejectWithValue(error.response.data);
    }

    throw error;
  }
});

export const deleteRecipe = createAsyncThunk<void, string, { state: RootState }>(
  'recipes/delete',
  async (id, { getState }) => {
    const token = getState().users.user?.token;
    await axiosApi.delete(`/recipes/${id}`, {
      headers: { Authorization: token },
    });
  },
);
