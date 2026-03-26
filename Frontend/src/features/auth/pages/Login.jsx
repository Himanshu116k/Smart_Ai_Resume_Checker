import "../../auth/auth.form.scss"
import {useNavigate,Link} from "react-router"
import { useAuth } from "../useAuth"
import { useState } from "react";
const Login = () => {


  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");


  const {loading,handleLogin} = useAuth();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    handleLogin({email, password});

  }

  // if(loading){
  //   return( <main>
  //     <h1>Loading........</h1>
  //   </main>)
  // }
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
