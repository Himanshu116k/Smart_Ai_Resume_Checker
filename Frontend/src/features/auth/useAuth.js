import { useContext } from "react";
import { AuthContext } from "./auth.context";
import { login, register, logut, getMe } from "./services/auth.api";


export const useAuth  = ()=>{
    const context = useContext(AuthContext)
    const {user,setUser,laoding,setloading} = context;



    const handleLogin = async ({email , password}) =>{
        setloading(true);
        const data = await login({email,password})
        setUser(data.user);
        setloading(false);
    }

    const handleRegister = async ({username,email,password}) =>{

        setloading(true);
        const data = await register({username,email,password})
        setUser(data.user);
        setloading(false);
    
    }





    

    const handleLogout = async() =>{
        setloading(true);
        const data = await logout();
        setUser(null);
    }


    return {user,laoding,handleLogin,handleRegister,handleLogout}
    

}
