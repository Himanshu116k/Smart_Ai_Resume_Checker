import axios from "axios"
export async function register(username,email,password) {
    try {
        
      const responce = await  axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/register`,{
            username,email,password
        },{
            withCredentials:true
        })

    } catch (error) {
        console.log(error);
    }
    

}

export async function login(email,password) {
    try {
         
        const responce = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`,{
            email,password
        },{
            withCredentialsL:true
        })

    } catch (error) {
        console.log(error);
    }
    
}