import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home  from './pages/Home';
import Error from './components/Error';

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
    ],
  },
]);

export default router;
