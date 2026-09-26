import { createSlice } from '@reduxjs/toolkit';
import type { Recipe, RecipeFull } from '../../interfaces';
import { fetchOneRecipe, fetchRecipes } from './recipesThunks';

interface State {
  items: Recipe[];
  item: RecipeFull | null;
  fetchLoading: boolean;
  fetchOneLoading: boolean;
}

const initialState: State = {
  items: [],
  item: null,
  fetchLoading: false,
  fetchOneLoading: false,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {},
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
  },
  selectors: {
    selectRecipes: (state) => state.items,
    selectRecipesLoading: (state) => state.fetchLoading,
    selectOneRecipe: (state) => state.item,
    selectOneRecipeLoading: (state) => state.fetchOneLoading,
  },
});

export const recipesReducer = recipesSlice.reducer;
export const {
  selectRecipes,
  selectRecipesLoading,
  selectOneRecipe,
  selectOneRecipeLoading,
} = recipesSlice.selectors;
