import { createSlice } from '@reduxjs/toolkit';
import type {
  Author,
  GlobalError,
  Recipe,
  RecipeFull,
  ValidationError,
} from '../../interfaces';
import {
  createRecipe,
  deleteRecipe,
  fetchAuthor,
  fetchOneRecipe,
  fetchRecipes,
} from './recipesThunks';

interface State {
  items: Recipe[];
  item: RecipeFull | null;
  author: Author | null;
  fetchLoading: boolean;
  fetchOneLoading: boolean;
  fetchAuthorLoading: boolean;
  createLoading: boolean;
  createError: ValidationError | GlobalError | null;
  deletingId: string | null;
}

const initialState: State = {
  items: [],
  item: null,
  author: null,
  fetchLoading: false,
  fetchOneLoading: false,
  fetchAuthorLoading: false,
  createLoading: false,
  createError: null,
  deletingId: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchRecipes.fulfilled, (state, { payload: recipes }) => {
        state.fetchLoading = false;
        state.items = recipes;
      })
      .addCase(fetchRecipes.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(fetchOneRecipe.pending, (state) => {
        state.fetchOneLoading = true;
        state.item = null;
      })
      .addCase(fetchOneRecipe.fulfilled, (state, { payload: recipe }) => {
        state.fetchOneLoading = false;
        state.item = recipe;
      })
      .addCase(fetchOneRecipe.rejected, (state) => {
        state.fetchOneLoading = false;
      });

    builder
      .addCase(fetchAuthor.pending, (state) => {
        state.fetchAuthorLoading = true;
        state.author = null;
      })
      .addCase(fetchAuthor.fulfilled, (state, { payload: author }) => {
        state.fetchAuthorLoading = false;
        state.author = author;
      })
      .addCase(fetchAuthor.rejected, (state) => {
        state.fetchAuthorLoading = false;
      });

    builder
      .addCase(createRecipe.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createRecipe.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createRecipe.rejected, (state, { payload: error }) => {
        state.createLoading = false;
        state.createError = error || null;
      });

    builder
      .addCase(deleteRecipe.pending, (state, { meta }) => {
        state.deletingId = meta.arg;
      })
      .addCase(deleteRecipe.fulfilled, (state, { meta }) => {
        state.deletingId = null;
        state.items = state.items.filter((recipe) => recipe._id !== meta.arg);
      })
      .addCase(deleteRecipe.rejected, (state) => {
        state.deletingId = null;
      });
  },
  selectors: {
    selectRecipes: (state) => state.items,
    selectRecipesLoading: (state) => state.fetchLoading,
    selectOneRecipe: (state) => state.item,
    selectOneRecipeLoading: (state) => state.fetchOneLoading,
    selectAuthor: (state) => state.author,
    selectAuthorLoading: (state) => state.fetchAuthorLoading,
    selectRecipeCreateLoading: (state) => state.createLoading,
    selectRecipeCreateError: (state) => state.createError,
    selectDeletingRecipeId: (state) => state.deletingId,
  },
});

export const recipesReducer = recipesSlice.reducer;
export const { clearCreateError } = recipesSlice.actions;
export const {
  selectRecipes,
  selectRecipesLoading,
  selectOneRecipe,
  selectOneRecipeLoading,
  selectAuthor,
  selectAuthorLoading,
  selectRecipeCreateLoading,
  selectRecipeCreateError,
  selectDeletingRecipeId,
} = recipesSlice.selectors;
