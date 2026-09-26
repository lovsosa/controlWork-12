import { useEffect } from 'react';
import { Container, Image, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BASE_URL } from '../../constants';
import NotFound from '../../components/NotFound/NotFound';
import { selectOneRecipe, selectOneRecipeLoading } from './recipesSlice';
import { fetchOneRecipe } from './recipesThunks';
import Comments from '../comments/Comments';

const RecipeDetails = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const recipe = useAppSelector(selectOneRecipe);
  const loading = useAppSelector(selectOneRecipeLoading);

  useEffect(() => {
    dispatch(fetchOneRecipe(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (!recipe) {
    return <NotFound />;
  }

  return (
    <Container className="pb-4" style={{ maxWidth: 820 }}>
      <h1 className="h2 mb-2">{recipe.title}</h1>
      <p className="text-muted">
        Автор: <Link to={`/authors/${recipe.author._id}`}>{recipe.author.displayName}</Link>
        {' · '}
        {dayjs(recipe.createdAt).format('DD.MM.YYYY')}
      </p>
      <Image
        src={`${BASE_URL}/${recipe.image}`}
        alt={recipe.title}
        rounded
        fluid
        className="mb-4 w-100"
        style={{ maxHeight: 460, objectFit: 'cover' }}
      />
      <div className="recipe-text">{recipe.description}</div>
      <Comments recipeId={recipe._id} recipeOwnerId={recipe.author._id} />
    </Container>
  );
};

export default RecipeDetails;
