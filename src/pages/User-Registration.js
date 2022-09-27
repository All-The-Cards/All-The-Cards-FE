import React, { useContext, useState, useEffect } from 'react'
import './User-Registration.css'
import { Link } from 'react-router-dom'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'
import * as server from '../functions/ServerTalk.js';

const Registration = (props) => {

  const gc = useContext(GlobalContext)

  const [underlineActiveUser, setUnderline] = useState(false)
  const [isShowing, setIsShowing] = useState(false)
  const [buttonHover, setButtonHover] = useState(false)
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isToolTipShown, setToolTip] = useState(false)
  const [successfulRegister, setSuccessfulRegister] = useState(false)
  const [randomPic, setRandomPic] = useState()


  useEffect(() => {
    getRandomBgImg()
  }, [])

  const getRandomBgImg = () => {
    server.post("/api/features/random/art").then(response => {
      let res = response
      // console.log(res) 
      setRandomPic(res.randomArt)
    })
  }

  const handlePasswordClick = () => {

    isShowing ? setIsShowing(false) : setIsShowing(true)

  };

  const handleChange = (event) => {

    const name = event.target.name
    const value = event.target.value
    setInputs(values => ({ ...values, [name]: value }))

  }

  const handleSubmit = (event) => {

    event.preventDefault()

    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/

    if (!inputs.password.match(check)) {
      alert("Password does not meet requirements. Hover of the password title to view requirements.")
      inputs.password = ""
      return
    }

    QueryRegister()

  }


  const QueryRegister = () => {
    gc.supabase.auth.signUp({
      email: inputs.email,
      password: inputs.password,
      options: {
        data: {
          name: inputs.name
        }
      }
    }).then(({ error }) => {
      console.log(error)
      if (error === null) {
        setSuccessfulRegister(true)
      }
      else {
        alert(error)
        inputs.email = ""
        inputs.password = ""
      }
    })

  }

  return (

    /* Login & Registration share some CSS properties (Login-Registration.css) */
    <div className='LoginContainer'>
      <div style={{ backgroundImage: `url(${randomPic})` }} className='LeftContainer'>
        <div className='ArtBlur' />
      </div>
      <div className='RightContainer'>
        <div className='RegistrationTitle'>Register</div>
        <Link to='/login' className={`ActiveUserLink ${underlineActiveUser ? "ActiveUserLinkAlt" : ''}`} onMouseEnter={() => setUnderline(true)} onMouseLeave={() => setUnderline(false)}>Already have an account?</Link>

        <form className='FormContainer' onSubmit={handleSubmit}>

          {/* EACH GROUP IS A TITLE WITH ITS INPUT THEY ARE SPACED OUT */}
          <div className='InputTitles'>Fullname</div>
          <input
            type="text"
            name="name"
            required
            value={inputs.name}
            onChange={handleChange}
            className="RegistrationInputs"
          />

          <div className='InputTitles'>Email</div>
          <input
            type="email"
            name="email"
            required
            value={inputs.email}
            onChange={handleChange}
            className="RegistrationInputs"
            maxLength={30}
          />

          <div className='InputTitles' onMouseEnter={() => setToolTip(true)} onMouseLeave={() => setToolTip(false)}>Password</div>
          <input
            type={isShowing ? "text" : "password"}
            name="password"
            required
            value={inputs.password}
            onChange={handleChange}
            className="RegistrationInputs"
            minLength={8}
            maxLength={20}
          />
          {!isShowing &&
            <img src={EyePassword2} alt='EyeIcon2' className='RegEyeIconAlt' onClick={handlePasswordClick} />
          }
          {isShowing &&
            <img src={EyePassword} alt='EyeIcon' className='RegEyeIcon' onClick={handlePasswordClick} />
          }
          {isToolTipShown &&
            <div className='ToolTipTriangle'>
              <div className='ToolTip'>
                Password Requirements:<br /><br />• Password length must be 8 characters<br />• Must include at least one uppercase letter<br />
                • Must include at least one number<br />• Cannot be more than 20 characters
              </div>
            </div>
          }

          {/* THIS IS THE SUCCESSFUL REGISTER MESSAGE THAT APPEARS WHEN YOUR REGISTRY GOES THROUGH */}
          {successfulRegister &&
            <div className='SuccessfulTip'>You have successfully registered!</div>
          }

          <input type="submit" className={`SubmitButton ${buttonHover ? "SubmitButtonAlt" : ''}`} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)} />

        </form>
      </div>

    </div>

  )
}

export default Registration