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
        throw error; // Re-throw so calling code can handle it
    }
}

export async function login(email, password) {
    try {
        // Handle both object and separate parameters
        if (typeof email === 'object' && email !== null) {
            password = email.password;
            email = email.email;
        }
         
        const responce = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`,{
            email,password
        },{
            withCredentials:true
        })
       console.log(responce);
        return responce.data;

    } catch (error) {
        console.log(error);
        throw error; // Re-throw so calling code can handle it
    }
}

export async function logout() {
    
    try {
        const responce = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/logout`,{
            withCredentials:true
        })
        
        return responce.data;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw so calling code can handle it
    }
}

export async function getMe(params) {

    try {

        const responce = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/get-me`,{
            withCredentials:true
        })
        
        return responce.data;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw so calling code can handle it
    }
}