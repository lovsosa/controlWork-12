import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRecipes, selectRecipesLoading } from './recipesSlice';
import { fetchRecipes } from './recipesThunks';
import RecipesGrid from './components/RecipesGrid';

const Recipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector(selectRecipes);
  const loading = useAppSelector(selectRecipesLoading);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  return (
    <Container className="pb-4">
      <h1 className="h3 mb-4">Все рецепты</h1>
      <RecipesGrid recipes={recipes} loading={loading} />
    </Container>
  );
};

export default Recipes;
