import { useContext,useEffect } from "react";
import { AuthContext } from "./auth.context";
import { login, register, logout, getMe } from "./services/auth.api";


export const useAuth  = ()=>{
    const context = useContext(AuthContext)
    const {user,setUser,laoding,setloading} = context;



    const handleLogin = async ({email , password}) =>{
        setloading(true);
        try{
            const data = await login(email, password)
            if (data && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Login error:", error);
            // Optional: You can add error state here to show user-facing error messages
        } finally {
            setloading(false);
        }
    }

    const handleRegister = async ({username,email,password}) =>{

        setloading(true);
        try{
            const data = await register(username,email,password)
            if (data && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Register error:", error);
        } finally {
            setloading(false);
        }

    }





    

    const handleLogout = async() =>{
        setloading(true);
        try{
            const data = await logout();
            if (data && data.success) {
                setUser(null);
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setloading(false);
        }
    }


      useEffect(()=>{
     const getAndSetUser = async ()=>{
        const data = await getMe();
        setUser(data.user)
        setloading(false)
     }
     getAndSetUser();
   },[])

    return {user,loading:laoding,handleLogin,handleRegister,handleLogout}
    

}
