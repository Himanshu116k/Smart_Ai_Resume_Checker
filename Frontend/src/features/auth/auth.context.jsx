import { useState, createContext } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
   const [user,setUser]  = useState(null);
   const [laoding,setloading] = useState(false);


   return(
    <AuthContext.Provider value ={{user,setUser,laoding,setloading}}>
        {children}
    </AuthContext.Provider>
   )



}