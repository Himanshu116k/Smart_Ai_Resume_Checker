import "../../auth/auth.form.scss"
import {useNavigate,Link} from "react-router"

const Login = () => {

  const handleSubmit = (e) =>{
    e.preventDefault();
  }

  return (
   <main>
    <div className="from-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group"> 
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" />
          
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your Password" />

        </div>
        <button className='button primary-button '>Login</button>
        <p>Don't have an account? <Link to='/register'>Register</Link> </p>

      </form>
    </div>
   </main>
  )
}

export default Login
