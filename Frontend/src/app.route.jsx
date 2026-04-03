import { createBrowserRouter } from "react-router";

import Resumpage from "./features/auth/pages/resumepage.jsx";
import HomePage from "./features/auth/pages/Homepage.jsx";

export const router = createBrowserRouter([
  
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