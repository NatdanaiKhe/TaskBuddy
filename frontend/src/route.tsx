import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home  from './pages/Home';
import Error from './components/Error';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './context/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element:  <MainLayout/>,
    errorElement: <Error/>,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />, 
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: 'admin',
        element:  <ProtectedRoute roles={['admin']}><div>admin</div></ProtectedRoute>
      }
    ],
  },
]);

export default router;
