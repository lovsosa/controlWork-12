import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppToolbar from './components/AppToolbar/AppToolbar';
import NotFound from './components/NotFound/NotFound';
import Login from './features/users/Login';
import Register from './features/users/Register';
import Recipes from './features/recipes/Recipes';
import RecipeDetails from './features/recipes/RecipeDetails';
import NewRecipe from './features/recipes/NewRecipe';
import AuthorRecipes from './features/recipes/AuthorRecipes';

const App = () => {
  return (
    <>
      <AppToolbar />
      <main>
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/recipes/new" element={<NewRecipe />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/authors/:id" element={<AuthorRecipes />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default App;
