import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import { useSelector } from "react-redux";
import Product from "./pages/Product";

function App() {
  const user = useSelector((state) => state.user.currentUser);
  
  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: user ? <Navigate to="/" /> : <Login />,
        },
        {
          path: "/register",
          element: user ? <Navigate to="/" /> : <Register />
        },
        {
          path: "/products",
          element: user ? <ProductList /> : <Navigate to="/login" />
        },
        {
          path: "/products/create",
          element: user ? <CreateProduct /> : <Navigate to="/login" />
        },
        {
          path: "/products/:productId",
          element: user ? <Product /> : <Navigate to="/login" />
        },
        {
          path: "/products/edit/:productId",
          element: user ? <EditProduct /> : <Navigate to="/login" />
        }
      ]
    }
  ]);

  return (
      <RouterProvider router={router} />
  );
}

export default App;
