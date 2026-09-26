import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import axiosApi from '../../axiosApi';
import type {
  Comment,
  CommentMutation,
  GlobalError,
  ValidationError,
} from '../../interfaces';
import type { RootState } from '../../app/store';

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetch',
  async (recipeId) => {
    const { data: comments } = await axiosApi.get<Comment[]>('/comments', {
      params: { recipe: recipeId },
    });
    return comments;
  },
);

export const createComment = createAsyncThunk<
  Comment,
  CommentMutation,
  { state: RootState; rejectValue: ValidationError | GlobalError }
>('comments/create', async (mutation, { getState, rejectWithValue }) => {
  const token = getState().users.user?.token;

  try {
    const { data: comment } = await axiosApi.post<Comment>('/comments', mutation, {
      headers: { Authorization: token },
    });
    return comment;
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

export const deleteComment = createAsyncThunk<void, string, { state: RootState }>(
  'comments/delete',
  async (id, { getState }) => {
    const token = getState().users.user?.token;
    await axiosApi.delete(`/comments/${id}`, {
      headers: { Authorization: token },
    });
  },
);
