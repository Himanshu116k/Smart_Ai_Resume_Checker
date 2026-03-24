import {createBrowersRouter} from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"




export const router = createBrowersRouter([
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }

])