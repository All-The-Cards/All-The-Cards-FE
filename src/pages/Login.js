import { Link } from 'react-router-dom'
import './Login.css'
import EyePassword from '../images/EyePassword.png'
import { React, useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";

const Login = (props) => {

  const [state, setState] = useState({
    
  })

  const {hasSearchBar, setSearchBar} = useContext(GlobalContext);

  useEffect(() => {
    setSearchBar(props.hasSearchBar)
  }, [])

  const [underlineRegister, setUnderlineRegister] = useState(false)
  const [underlineForgot, setUnderlineForgot] = useState(false)
  const [isShowing, setIsShown] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  // const [inputs, setInputs] = useState({});

  // const handleChange = (event) => {
  //   const firstname = event.target.firstname;
  //   const lastname = event.target.value;
  //   setInputs(values => ({...values, [name]: value}))
  // }

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   alert(inputs);
  // }

    const handleClick = () => {
      
      isShowing ? setIsShown(false) : setIsShown(true)

    };

  return (

    <div className='LoginContainer'>
      <div className='LeftContainer'/>
      <div className='RightContainer'>

        <div className='LoginTitle'>Login</div>
        <Link to='/registration' className={`RegisterLink ${underlineRegister ? "RegisterLinkAlt" : ''}`} onMouseEnter={() => setUnderlineRegister(true)} onMouseLeave={() => setUnderlineRegister(false)}>Need an Account?</Link>
      
        <form className='FormContainer'>
          <div className='InputTitles'>Email/Username</div>
          <input
            type="text"
            className="RegistrationInputs"
            placeholder="Username"
            maxLength={35}
            // value={inputs.username || ""}
            // onChange={handleChanges}
          />
          <div className='InputTitles'>Password</div>
          <input
            type={isShowing ? "text" : "password"}
            className="RegistrationInputs"
            placeholder="Password"
            maxLength={35}
            // value={inputs.username || ""}
            // onChange={handleChanges}
          />
          <div className={`ForgotPasswordLink ${underlineForgot ? "ForgotPasswordLinkAlt" : ''}`} onMouseEnter={() => setUnderlineForgot(true)} onMouseLeave={() => setUnderlineForgot(false)}>Forgot Password?</div>
          <img src={EyePassword} alt='EyeIcon' className='EyeIcon' onClick={handleClick}/>
        </form>
        <button className={`SubmitButton ${buttonHover ? "SubmitButtonAlt" : ''}`} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}>Submit</button>
      </div>
    </div>

  )}

export default Login