import { useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import NotFound from '../../components/NotFound/NotFound';
import { selectUser } from '../users/usersSlice';
import {
  selectAuthor,
  selectAuthorLoading,
  selectDeletingRecipeId,
  selectRecipes,
  selectRecipesLoading,
} from './recipesSlice';
import { deleteRecipe, fetchAuthor, fetchRecipes } from './recipesThunks';
import RecipesGrid from './components/RecipesGrid';

const AuthorRecipes = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const author = useAppSelector(selectAuthor);
  const authorLoading = useAppSelector(selectAuthorLoading);
  const recipes = useAppSelector(selectRecipes);
  const recipesLoading = useAppSelector(selectRecipesLoading);
  const deletingId = useAppSelector(selectDeletingRecipeId);

  const isOwner = user?._id === id;

  useEffect(() => {
    dispatch(fetchAuthor(id));
    dispatch(fetchRecipes(id));
  }, [dispatch, id]);

  const onDelete = async (recipeId: string) => {
    if (!window.confirm('Удалить этот рецепт?')) return;

    const result = await dispatch(deleteRecipe(recipeId));
    if (deleteRecipe.fulfilled.match(result)) {
      toast.success('Рецепт удалён');
    } else {
      toast.error('Не удалось удалить рецепт');
    }
  };

  if (authorLoading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!author) {
    return <NotFound />;
  }

  return (
    <Container className="pb-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">
          {isOwner ? 'Мои рецепты' : `Рецепты автора ${author.displayName}`}
        </h1>
        {isOwner && (
          <Link to="/recipes/new" className="btn btn-success">
            Создать новый рецепт
          </Link>
        )}
      </div>
      <RecipesGrid
        recipes={recipes}
        loading={recipesLoading}
        onDelete={isOwner ? onDelete : undefined}
        deletingId={deletingId}
      />
    </Container>
  );
};

export default AuthorRecipes;
