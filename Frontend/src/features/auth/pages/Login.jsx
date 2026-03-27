import "../../auth/auth.form.scss"
import {useNavigate,Link} from "react-router"
import { useAuth } from "../useAuth"
import { use, useState } from "react";
import Loader from "../components/Loder";

const Login = () => {

  const Navigate = useNavigate();

  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");


  const {loading,handleLogin} = useAuth();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    await handleLogin({email, password});
    Navigate("/")

  }

  if(loading){
    return( <main>
     <Loader/>
    </main>)
  }
  return (
   <main>
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group"> 
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>(setEmail(e.target.value))} type="email" id="email" name="email" placeholder="Enter your email" />
          
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>(setPassword(e.target.value))} type="password" id="password" name="password" placeholder="Enter your Password" />

        </div>
        <button className='button primary-button '>Login</button>
        <p>Don't have an account? <Link to='/register'>Register</Link> </p>

      </form>
    </div>
   </main>
  )
}

export default Login
