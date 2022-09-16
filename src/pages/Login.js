import { React, useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './Login-Registration.css'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'
import * as server from '../functions/ServerTalk.js';

const Login = (props) => {

  const gc = useContext(GlobalContext)

  const [underlineRegister, setUnderlineRegister] = useState(false)
  const [underlineForgot, setUnderlineForgot] = useState(false)
  const [isShowing, setIsShown] = useState(false)
  const [isModalActive, setModal] = useState(false)
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [randomPic,setRandomPic] = useState("")

  const nav = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(()=>{
    gc.setSearchBar(props.hasSearchBar)
    getRandomBgImg()
  }, [])

  const getRandomBgImg = () =>{
    server.post("/api/features/random/art").then(response => {
      let res = response
      // console.log(res) 
      setRandomPic(res.randomArt)
    })
  } 

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

    // Handles clicking outside of the menu
  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        
      setModal(false)
    }
  };

  const handleForgotPassword = () => {
    setModal(true)
  };

  const LoginQuery = () =>{

    gc.supabase.auth.signInWithPassword({
      email: inputs.email,
      password: inputs.password,
    }).then(({user,session,error})=>{
      console.log(user,session)
      if(error === null)
      {
        alert("Login Successful! Routing to homepage.")
        nav('/')
      }
      else
      {
        alert(error)
        inputs.email = ""
        inputs.password = ""
      }
    })

  }

  // useEffect(()=>{

  //     console.log(inputs)
        
  //   },[inputs])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)
    return () => {
        document.addEventListener("click", handleClickOutside, true)
    }
  }, [wrapperRef]);

  return (

    <div className='LoginContainer'>
      <div style={{backgroundImage: `url(${randomPic})`}} className='LeftContainer'>
        <div className='ArtBlur'/>
      </div>
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
              value={inputs.email}
              onChange={handleChange}
            />
            <div className='InputTitles'>Password</div>
            <input
              type={isShowing ? "text" : "password"}
              name="password"
              className="RegistrationInputs"
              maxLength={35}
              minLength={8}
              value={inputs.password}
              onChange={handleChange}
            />
            <div className={`ForgotPasswordLink ${underlineForgot ? "ForgotPasswordLinkAlt" : ''}`} onClick={handleForgotPassword} onMouseEnter={() => setUnderlineForgot(true)} onMouseLeave={() => setUnderlineForgot(false)}>Forgot Password?</div>
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

      {isModalActive &&
        <div className='ModalWindowBackground'>
          <div className='ModalWindowContainer' ref={wrapperRef}>
            <h2>Password Reset</h2>
            <p>In order to reset your password, you will need to provide the email you registered with.</p>
            <form>
              <label>
                Email:
                <input
                  type="email"
                  className="RegistrationInputs"
                  maxLength={35}
                />
              </label>
            </form>
          </div>
        </div>
      }
    </div>

  )}

export default Login