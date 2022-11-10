import { React, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Login-Registration.css'
import './ResetPassword.css'
import EyePassword from '../images/EyePassword.png'
import EyePassword2 from '../images/HiddenEyePassword.png'
import { GlobalContext } from '../context/GlobalContext'
import * as server from '../functions/ServerTalk.js';

const ResetPassword = (props) => {

  const gc = useContext(GlobalContext)
  const { darkMode } = useContext(GlobalContext)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isShowingNewPass, setIsShowningNewPass] = useState(false)
  const [isShowingConfirmPass, setIsShowningConfirmPass] = useState(false)
  const [randomPic, setRandomPic] = useState("")
  const [isToolTipShown, setToolTip] = useState(false)
  const [hash, setHash] = useState(null);

  const nav = useNavigate()

  useEffect(() => {
    gc.setSearchBar(props.value)
    document.title = "Reset Password"
    // getRandomBgImg()
    setHash(window.location.hash)
  }, [])

  const getRandomBgImg = () => {
    server.post("/api/features/random/art").then(response => {
      let res = response
      setRandomPic(res.randomArt)
    })
  }

  const handleChange = (event) => {

    if (event.target.id === "resetPass") {
      setNewPassword(event.target.value)
    }
    else {
      setConfirmPassword(event.target.value)
    }
  }

  const handlePasswordClick = (event) => {

    if (event.target.id === "one" || event.target.id === "two")
      isShowingNewPass ? setIsShowningNewPass(false) : setIsShowningNewPass(true)
    else
      isShowingConfirmPass ? setIsShowningConfirmPass(false) : setIsShowningConfirmPass(true)

  };

  const updatePassword = async (event) => {
    event.preventDefault()

    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again...")
      setConfirmPassword('')
    }
    else if (!newPassword.match(check)) {
      alert("Password does not meet requirements. Hover of the password title to view requirements.")
      setNewPassword("")
      setConfirmPassword("")
      return
    }

    try {
      // if the user doesn't have accesstoken
      if (!hash) {
        console.log('INVALID TOKEN')
      } else if (hash) {
        const hashArr = hash
          .substring(1)
          .split("&")
          .map((param) => param.split("="));

        let type;
        let accessToken;
        for (const [key, value] of hashArr) {
          if (key === "type") {
            type = value;
          } else if (key === "access_token") {
            accessToken = value;
          }
        }

        if (
          type !== "recovery" ||
          !accessToken ||
          typeof accessToken === "object"
        ) {
          console.log('INVALID TYPE OR TOKEN')
          return;
        }

        //   now we will change the password
        const { error } = await gc.supabase.auth.updateUser({ password: newPassword });

        if (error) {
          alert(error)
        } else if (!error) {
          alert("Password has be updated! Rerouting to homepage.")
          nav('/')
        }
      }
    } catch (error) {
      alert(error);
    }
  }


  return (

    <div className={`LoginContainer Page${darkMode ? "LoginContainerDark Page" : ''}`}>
      <div style={{ backgroundImage: `url("https://c1.scryfall.com/file/scryfall-cards/art_crop/front/7/8/787de9ce-02c5-4a17-a88b-d38e83dbeb0b.jpg?1572893092")` }} className='LeftContainer'>
        <div className='ArtBlur' />
      </div>
      <div className='RightContainer'>

        <div className={`LoginTitle ${darkMode ? "LoginTitleDark" : ''}`}>Reset Password</div>
        <div className='FormBox'>
          <form className='FormContainer'>
            <div className={`InputTitles ${darkMode ? "InputTitlesDark" : ''}`} onMouseEnter={() => setToolTip(true)} onMouseLeave={() => setToolTip(false)}>New Password</div>
            <input
              id='resetPass'
              type={isShowingNewPass ? "text" : "password"}
              className="RegistrationInputs"
              maxLength={35}
              minLength={8}
              value={newPassword}
              onChange={handleChange}
            />
            <div className={`InputTitles ${darkMode ? "InputTitlesDark" : ''}`}>Confirm Password</div>
            <input
              id='confirmPass'
              type={isShowingConfirmPass ? "text" : "password"}
              className="RegistrationInputs"
              maxLength={35}
              minLength={8}
              value={confirmPassword}
              onChange={handleChange}
            />
            {!isShowingNewPass &&
              <img id='one' src={EyePassword2} alt='EyeIcon2' className='EyeIconAlt' onClick={handlePasswordClick} />
            }
            {isShowingNewPass &&
              <img id='two' src={EyePassword} alt='EyeIcon' className='EyeIcon' onClick={handlePasswordClick} />
            }
            {!isShowingConfirmPass &&
              <img id='three' src={EyePassword2} alt='EyeIcon2' className='EyeIconAlt' onClick={handlePasswordClick} />
            }
            {isShowingConfirmPass &&
              <img id='four' src={EyePassword} alt='EyeIcon' className='EyeIcon' onClick={handlePasswordClick} />
            }

            <button className='SubmitButton' onClick={updatePassword}>Submit</button>

            {isToolTipShown &&
              <div className='ToolTipTriangle2'>
                <div className='ToolTip2'>
                  Password Requirements:<br /><br />• Password length must be 8 characters<br />• Must include at least one uppercase letter<br />
                  • Must include at least one number<br />• Cannot be more than 20 characters
                </div>
              </div>
            }
          </form>
        </div>
      </div>
    </div>

  )
}

export default ResetPassword