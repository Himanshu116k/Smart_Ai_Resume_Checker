import axios from "axios"
export async function register(username,email,password) {
    try {
        
      const responce = await  axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/register`,{
            username,email,password
        },{
            withCredentials:true
        })

        return responce.data;

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

        return responce.data;

    } catch (error) {
        console.log(error);
    }
    
}

export async function logut() {
    
    try {
        const responce = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`,{
            withCredentials:true
        })
        
        return responce.data;
    } catch (error) {
                console.log(error);

    }
}

export async function getMe(params) {

    try {

        const responce = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/get-me`,{
            withCredentials:true
        })
        
    } catch (error) {
        console.log(error);
    }
}