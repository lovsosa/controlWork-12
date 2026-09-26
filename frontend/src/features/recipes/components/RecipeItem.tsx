import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Recipe } from '../../../interfaces';
import { BASE_URL } from '../../../constants';

interface Props {
  recipe: Recipe;
}

const RecipeItem = ({ recipe }: Props) => {
  return (
    <Card className="h-100 shadow-sm">
      <Link to={`/recipes/${recipe._id}`}>
        <Card.Img
          variant="top"
          src={`${BASE_URL}/${recipe.image}`}
          alt={recipe.title}
          style={{ height: 200, objectFit: 'cover' }}
        />
      </Link>
      <Card.Body>
        <Card.Title className="fs-5">
          <Link to={`/recipes/${recipe._id}`} className="text-reset text-decoration-none">
            {recipe.title}
          </Link>
        </Card.Title>
        <Card.Text className="mb-0">
          Автор: <Link to={`/authors/${recipe.author._id}`}>{recipe.author.displayName}</Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default RecipeItem;
