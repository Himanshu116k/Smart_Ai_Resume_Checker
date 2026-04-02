import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Resumpage from "./features/auth/pages/resumepage";
import HomePage from "./features/auth/pages/Homepage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/resume",
    element: <Resumpage />
  },
  {
    path:"/",
    element:  <HomePage/> 

  }
  // {
  //   path:"/",
  //   element: <Protected> <h1>Welcome to the App</h1> </Protected>

  // }
]);