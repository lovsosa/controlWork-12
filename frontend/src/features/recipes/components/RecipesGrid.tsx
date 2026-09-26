import { Col, Row, Spinner } from 'react-bootstrap';
import type { Recipe } from '../../../interfaces';
import RecipeItem from './RecipeItem';

interface Props {
  recipes: Recipe[];
  loading: boolean;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

const RecipesGrid = ({ recipes, loading, onDelete, deletingId }: Props) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  if (recipes.length === 0) {
    return <p className="text-muted">Рецептов пока нет</p>;
  }

  return (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe._id}>
          <RecipeItem
            recipe={recipe}
            onDelete={onDelete ? () => onDelete(recipe._id) : undefined}
            deleting={deletingId === recipe._id}
          />
        </Col>
      ))}
    </Row>
  );
};

export default RecipesGrid;
