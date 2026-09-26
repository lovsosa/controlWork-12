import { Col, Row, Spinner } from 'react-bootstrap';
import type { Recipe } from '../../../interfaces';
import RecipeItem from './RecipeItem';

interface Props {
  recipes: Recipe[];
  loading: boolean;
}

const RecipesGrid = ({ recipes, loading }: Props) => {
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
          <RecipeItem recipe={recipe} />
        </Col>
      ))}
    </Row>
  );
};

export default RecipesGrid;
