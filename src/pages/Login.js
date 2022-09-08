import { React, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Login-Registration.css'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'

const Login = () => {

  const { supabase } = useContext(GlobalContext)

  const [underlineRegister, setUnderlineRegister] = useState(false)
  const [underlineForgot, setUnderlineForgot] = useState(false)
  const [isShowing, setIsShown] = useState(false)
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {

    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({...values, [name]: value}))
  
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    LoginQuery();
  }

  const handlePasswordClick = () => {
      
    isShowing ? setIsShown(false) : setIsShown(true)

  };

  async function LoginQuery(){
    
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email: inputs.email,
      password: inputs.password,
    })

    alert(error)

  }

  return (

    <div className='LoginContainer'>
      <div className='LeftContainer'/>
      <div className='RightContainer'>

        <div className='LoginTitle'>Login</div>
        <Link to='/registration' className={`RegisterLink ${underlineRegister ? "RegisterLinkAlt" : ''}`} onMouseEnter={() => setUnderlineRegister(true)} onMouseLeave={() => setUnderlineRegister(false)}>Need an Account?</Link>
        <div className='FormBox'>
          <form className='FormContainer'>
            <div className='InputTitles'>Email</div>
            <input
              type="email"
              name="email"
              className="RegistrationInputs"
              maxLength={35}
              value={inputs.email || ""}
              onChange={handleChange}
            />
            <div className='InputTitles'>Password</div>
            <input
              type={isShowing ? "text" : "password"}
              name={"password"}
              className="RegistrationInputs"
              maxLength={35}
              minLength={8}
              value={inputs.password || ""}
              onChange={handleChange}
            />
            <div className={`ForgotPasswordLink ${underlineForgot ? "ForgotPasswordLinkAlt" : ''}`} onMouseEnter={() => setUnderlineForgot(true)} onMouseLeave={() => setUnderlineForgot(false)}>Forgot Password?</div>
              {!isShowing &&
                <img src={EyePassword2} alt='EyeIcon2' className='EyeIconAlt' onClick={handlePasswordClick}/>
              }
              {isShowing &&
                <img src={EyePassword} alt='EyeIcon' className='EyeIcon' onClick={handlePasswordClick}/>
              }

            <button className='SubmitButton' onClick={handleSubmit}>Submit</button>
          </form>
        </div>
      </div>
    </div>

  )}

export default Login