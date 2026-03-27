import { useAuth } from "../useAuth";
import Loader from "./Loder";
import { Navigate } from "react-router";
const Protected = ({children})=>{
    // const navigate = useNavigate();
    
    const {loading , user} = useAuth()

    if(loading){
        return <main>
            <Loader/>
        </main> 
    }
    if(!user){
       return <Navigate to='/login'/>
    }

    return children
}

export default Protected;