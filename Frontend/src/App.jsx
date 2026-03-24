import { RouterProvider } from "react-router"
import {router} from "./app.route.jsx"

function App() {

  return (
   <>
   <RouterProvider router={router}/>
   </>
  )
}

export default App
