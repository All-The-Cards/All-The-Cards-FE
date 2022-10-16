import { React, useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'
import './Login-Registration.css'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'
import * as server from '../functions/ServerTalk.js';

const Login = () => {

  const gc = useContext(GlobalContext)
  const { activeSession, setActiveSession } = useContext(GlobalContext)

  const [underlineRegister, setUnderlineRegister] = useState(false)
  const [underlineForgot, setUnderlineForgot] = useState(false)
  const [isShowing, setIsShown] = useState(false)
  const [isModalActive, setModal] = useState(false)
  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [randomPic, setRandomPic] = useState("")
  const [passwordResetEmail, setResetEmail] = useState("");

  const nav = useNavigate()
  const wrapperRef = useRef(null)

  useEffect(() => {
    // getRandomBgImg()
    document.title = "Login"
  }, [])

  const getRandomBgImg = () => {

    server.post("/api/features/random/art").then(response => {
      let res = response
      setRandomPic(res.randomArt)
    })

  }

  const handleChange = (event) => {

    if (event.id !== "resetPass") {
      const name = event.target.name
      const value = event.target.value
      setInputs(values => ({ ...values, [name]: value }))
    }

    setResetEmail(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (event.target.id === 'resetButton') {
      PasswordReset();
    }
    else
      LoginQuery();
  }

  async function PasswordReset() {
    // event.preventDefault();
    const { data, error } = await gc.supabase.auth.resetPasswordForEmail(
      passwordResetEmail,
      {
        redirectTo: "http://localhost:3000/reset-password",
      }
    )
    if (error) {
      alert(error)
    }
    else {
      alert("An email has been sent to email you provided. Please view this email and click the reset password link.")
      setModal(false)
    }
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

  async function LoginQuery() {

    await gc.supabase.auth.signInWithPassword(
      {
        email: inputs.email,
        password: inputs.password,
      },
      {
        data: {
          fullname: inputs.name
        },
      }).then(({ error, data }) => {
        if (error === null) {
          alert("Login Successful! Routing to homepage.")
          setActiveSession(data.session)
          setLocalUsername(data)
          nav('/')
        }
        else {
          alert(error)
          inputs.email = ""
          inputs.password = ""
        }
      })

  }

  //   const GetUserInfo = () => {

  //     gc.supabase.auth.getSession().then(({ data: { session }, error }) => {
  //       if (error !== null) {
  //         alert(error)
  //       }
  //       else if (session !== null) {
  //         setActiveSession(session)
  //       }
  //     })

  //   gc.supabase.auth.getUser().then(({ data: { user }, error }) => {
  //     if (error !== null) {
  //       alert(error)
  //     }
  //     else {
  //       gc.setUser(user)
  //     }
  //   })

  // }

  // useEffect(() => {

  //   console.log(activeSession)

  // }, [activeSession]);

  const setLocalUsername = (data) => {
    if (data !== null && Object.keys(data.user.user_metadata).length !== 0)
      localStorage.setItem("userName", JSON.stringify(data.user.user_metadata.name.split(" ")[0]));
    else
      localStorage.setItem("userName", "User");
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true)
    return () => {
      document.addEventListener("click", handleClickOutside, true)
    }
  }, [wrapperRef]);

  return (

    <div className='LoginContainer'>
      <div style={{ backgroundImage: `url("https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092")` }} className='LeftContainer'>
        <div className='ArtBlur' />
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
              required
              className="RegistrationInputs"
              maxLength={35}
              value={inputs.email}
              onChange={handleChange}
            />
            <div className='InputTitles'>Password</div>
            <input
              type={isShowing ? "text" : "password"}
              name="password"
              required
              className="RegistrationInputs"
              maxLength={35}
              minLength={8}
              value={inputs.password}
              onChange={handleChange}
            />
            <div className={`ForgotPasswordLink ${underlineForgot ? "ForgotPasswordLinkAlt" : ''}`} onClick={handleForgotPassword} onMouseEnter={() => setUnderlineForgot(true)} onMouseLeave={() => setUnderlineForgot(false)}>Forgot Password?</div>
            {!isShowing &&
              <img src={EyePassword2} alt='EyeIcon2' className='EyeIconAlt' onClick={handlePasswordClick} />
            }
            {isShowing &&
              <img src={EyePassword} alt='EyeIcon' className='EyeIcon' onClick={handlePasswordClick} />
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
                  id="resetPass"
                  type="email"
                  className="RegistrationInputs"
                  maxLength={35}
                  value={passwordResetEmail}
                  onChange={handleChange}
                />
              </label>
              <br /><br />
              <button id='resetButton' className='SubmitButton' onClick={handleSubmit}>Submit</button>
            </form>
          </div>
        </div>
      }
    </div>

  )
}

export default Login