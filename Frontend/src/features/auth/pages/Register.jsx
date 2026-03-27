import React, { useState } from 'react'
import {useNavigate,Link} from "react-router"
import { useAuth } from "../useAuth"
import Loader from '../components/Loder';


const Register = () => {

  const {loading,handleRegister} = useAuth();
  const [username,setusername] = useState("")
  const [email,setemail] = useState("")
  const [password,setpassword] = useState("")

  const navigate = useNavigate();

  

   const handleSubmit =  async (e) =>{
    e.preventDefault();
    await handleRegister({username,email,password});
    navigate("/")
  }
   if(loading){
    return( <main>
     <Loader/>
    </main>)
  }
  return (
    <main>
    <div className="from-container">
      <h1>Register
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group"> 
          <label htmlFor="username">UserName</label>
          <input onChange={(e)=>(setusername(e.target.value))} type="text" id="username" name="username" placeholder="Enter your UserName" />
          
        </div>
        <div className="input-group"> 
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>(setemail(e.target.value))} type="email" id="email" name="email" placeholder="Enter your email" />
          
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>(setpassword(e.target.value))} type="password" id="password" name="password" placeholder="Enter your Password" />

        </div>
        <button className='button primary-button '>Register

        </button>
      </form>
      <p>Already have an account? <Link to='/login'>Login</Link> </p>
    </div>
   </main>
  )
}

export default Register
