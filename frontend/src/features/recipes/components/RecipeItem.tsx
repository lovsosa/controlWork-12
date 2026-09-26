import { Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Recipe } from '../../../interfaces';
import { BASE_URL } from '../../../constants';

interface Props {
  recipe: Recipe;
  onDelete?: () => void;
  deleting?: boolean;
}

const RecipeItem = ({ recipe, onDelete, deleting }: Props) => {
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
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-5">
          <Link to={`/recipes/${recipe._id}`} className="text-reset text-decoration-none">
            {recipe.title}
          </Link>
        </Card.Title>
        <Card.Text className="mb-0">
          Автор: <Link to={`/authors/${recipe.author._id}`}>{recipe.author.displayName}</Link>
        </Card.Text>
        {onDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            className="mt-3 align-self-start"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting && <Spinner as="span" size="sm" className="me-2" />}
            Удалить
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecipeItem;
