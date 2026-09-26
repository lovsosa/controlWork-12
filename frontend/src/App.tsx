import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppToolbar from './components/AppToolbar/AppToolbar';
import NotFound from './components/NotFound/NotFound';
import Login from './features/users/Login';
import Register from './features/users/Register';

const App = () => {
  return (
    <>
      <AppToolbar />
      <main>
        <Routes>
          <Route path="/" element={<h1 className="container h4">Рецепты</h1>} />
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
