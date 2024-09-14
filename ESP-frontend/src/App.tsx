import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './HomePage';
import CategoryPage from './CategoryPage';
import RecipePage from './RecipePage';
import LayOut from './Layout'; 

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayOut />, 
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'category/:name',
        element: <CategoryPage />,
      },
      {
        path: 'category/:name/:title',
        element: <RecipePage />
      }
    ],
  },
]);

function App(): JSX.Element {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
