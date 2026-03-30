import { useState, createContext,useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
   const [user,setUser]  = useState(null);
   const [laoding,setloading] = useState(true);


 

   return(
    <AuthContext.Provider value ={{user,setUser,laoding,setloading}}>
        {children}
    </AuthContext.Provider>
   )



}