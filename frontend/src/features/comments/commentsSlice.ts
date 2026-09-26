import { createSlice } from '@reduxjs/toolkit';
import type { Comment, GlobalError, ValidationError } from '../../interfaces';
import { createComment, deleteComment, fetchComments } from './commentsThunks';

interface State {
  items: Comment[];
  fetchLoading: boolean;
  createLoading: boolean;
  createError: ValidationError | GlobalError | null;
  deletingId: string | null;
}

const initialState: State = {
  items: [],
  fetchLoading: false,
  createLoading: false,
  createError: null,
  deletingId: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.fetchLoading = true;
        state.items = [];
      })
      .addCase(fetchComments.fulfilled, (state, { payload: comments }) => {
        state.fetchLoading = false;
        state.items = comments;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(createComment.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createComment.fulfilled, (state, { payload: comment }) => {
        state.createLoading = false;
        state.items.push(comment);
      })
      .addCase(createComment.rejected, (state, { payload: error }) => {
        state.createLoading = false;
        state.createError = error || null;
      });

    builder
      .addCase(deleteComment.pending, (state, { meta }) => {
        state.deletingId = meta.arg;
      })
      .addCase(deleteComment.fulfilled, (state, { meta }) => {
        state.deletingId = null;
        state.items = state.items.filter((comment) => comment._id !== meta.arg);
      })
      .addCase(deleteComment.rejected, (state) => {
        state.deletingId = null;
      });
  },
  selectors: {
    selectComments: (state) => state.items,
    selectCommentsLoading: (state) => state.fetchLoading,
    selectCommentCreateLoading: (state) => state.createLoading,
    selectCommentCreateError: (state) => state.createError,
    selectDeletingCommentId: (state) => state.deletingId,
  },
});

export const commentsReducer = commentsSlice.reducer;
export const {
  selectComments,
  selectCommentsLoading,
  selectCommentCreateLoading,
  selectCommentCreateError,
  selectDeletingCommentId,
} = commentsSlice.selectors;
