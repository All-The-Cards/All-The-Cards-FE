import { React, useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer/Footer';
import { GlobalContext } from "../context/GlobalContext";
import './CardCreator.css'

// Empty Cards
import WhiteCard from '../images/MTG-WhiteCard.png'
import BlackCard from '../images/MTG-BlackCard.png'
import BlueCard from '../images/MTG-BlueCard.png'
import RedCard from '../images/MTG-RedCard.png'
import GreenCard from '../images/MTG-GreenCard.png'

// Mana Symbols
import WhiteMana from '../images/WhiteMana.svg'
import BlackMana from '../images/BlackMana.svg'
import BlueMana from '../images/BlueMana.svg'
import RedMana from '../images/RedMana.svg'
import GreenMana from '../images/GreenMana.svg'
import WhtBlkMana from '../images/WhtBlkMana.svg'
import WhtBluMana from '../images/WhtBluMana.svg'
import WhtGrnMana from '../images/WhtGrnMana.svg'
import WhtRdMana from '../images/WhtRdMana.svg'

// Mana Amount
import Zero from '../images/Zero.png'
import One from '../images/One.svg'
import Two from '../images/Two.svg'
import Three from '../images/Three.svg'
import Four from '../images/Four.svg'
import Five from '../images/Five.svg'
import Six from '../images/Six.svg'
import Seven from '../images/Seven.svg'
import Eight from '../images/Eight.svg'
import Nine from '../images/Nine.svg'
import Ten from '../images/Ten.png'
import Eleven from '../images/Eleven.png'
import Twelve from '../images/Twelve.png'
import Thirteen from '../images/Thirteen.png'
import Fourteen from '../images/Fourteen.png'
import Fifteen from '../images/Fifteen.png'
import Sixteen from '../images/Sixteen.png'
import Seventeen from '../images/Seventeen.png'
import Eighteen from '../images/Eighteen.png'
import Nineteen from '../images/Nineteen.png'
import Twenty from '../images/Twenty.png'

// Images
import Default from '../images/DefaultImage.jpg'

const CardCreator = (props) => {

  const gc = useContext(GlobalContext)
  const [cardImage, setCardImage] = useState(WhiteCard)
  const [artwork, setArtwork] = useState(<img className='CardImage' src={Default} alt='photo'></img>)
  const [tempImage, setTempImage] = useState(null)
  const [cardName, setCardName] = useState('Card Name')
  const [manaImage, setManaImage] = useState()
  const [numberImage, setNumberImage] = useState(One)
  const [isDisabled1, setDisable1] = useState(true)
  const [isDisabled2, setDisable2] = useState(true)
  const [checked, setCheck] = useState(false)
  const [cardType, setCardType] = useState('Land')
  const [subType, setSubType] = useState('Subtype Name')
  const [needSub, setSub] = useState(false)
  const [textArea, setTextArea] = useState('Card Description Here...')
  const [attack, setAttack] = useState(0)
  const [defense, setDefense] = useState(0)
  const [radioSelection1, setRadioSelection1] = useState('WhiteCard')
  const [radioSelection2, setRadioSelection2] = useState('WhiteMana')
  const [radioSelection3, setRadioSelection3] = useState('Land')
  const [manas, setManas] = useState([])
  const [genManaNumber, setGenManaNumber] = useState(0)

  useEffect(() => {
    document.title = "Card Creator"
    gc.setSearchBar(props.hasSearchBar)
  }, [])

  const radioChange = (event) => {
    let target = event.target.value

    switch (target) {
      case 'WhiteCard':
        setRadioSelection1(() => 'WhiteCard')
        setCardImage(WhiteCard)
        break
      case 'BlackCard':
        setRadioSelection1('BlackCard')
        setCardImage(BlackCard)
        break
      case 'BlueCard':
        setRadioSelection1('BlueCard')
        setCardImage(BlueCard)
        break
      case 'RedCard':
        setRadioSelection1('RedCard')
        setCardImage(RedCard)
        break
      case 'GreenCard':
        setRadioSelection1('GreenCard')
        setCardImage(GreenCard)
        break
      case 'WhiteMana':
        setRadioSelection2('WhiteMana')
        break
      case 'BlackMana':
        setRadioSelection2('BlackMana')
        break
      case 'BlueMana':
        setRadioSelection2('BlueMana')
        break
      case 'RedMana':
        setRadioSelection2('RedMana')
        break
      case 'GreenMana':
        setRadioSelection2('GreenMana')
        break
      case 'WhtBlkMana':
        setRadioSelection2('WhtBlkMana')
        break
      case 'WhtBluMana':
        setRadioSelection2('WhtBluMana')
        break
      case 'WhtGrnMana':
        setRadioSelection2('WhtGrnMana')
        break
      case 'WhtRdMana':
        setRadioSelection2('WhtRdMana')
        break
      case 'Land':
        setRadioSelection3('Land')
        setCardType('Land')
        setSub(false)
        setDisable1(true)
        setDisable2(true)
        break
      case 'Creature':
        setRadioSelection3('Creature')
        setCardType('Creature -')
        setSub(true)
        setDisable1(false)
        setDisable2(false)
        break
      case 'Enchantment':
        setRadioSelection3('Enchantment')
        setCardType('Enchantment')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'Artifact':
        setRadioSelection3('Artifact')
        setCardType('Artifact')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'Instant':
        setRadioSelection3('Instant')
        setCardType('Instant')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'Sorcery':
        setRadioSelection3('Sorcery')
        setCardType('Sorcery')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'Artifact Creature':
        setRadioSelection3('Artifact Creature')
        setCardType('Artifact Creature -')
        setSub(true)
        setDisable1(false)
        setDisable2(false)
        break
    }
  };

  const manaChange = (event) => {
    let target = event.target.value
    console.log(target)

    switch (target) {
      case '0':
        setGenManaNumber(0)
        setNumberImage(Zero)
        break
      case '1':
        setGenManaNumber(1)
        setNumberImage(One)
        break
      case '2':
        setGenManaNumber(2)
        setNumberImage(Two)
        break
      case '3':
        setGenManaNumber(3)
        setNumberImage(Three)
        break
      case '4':
        setGenManaNumber(4)
        setNumberImage(Four)
        break
      case '5':
        setGenManaNumber(5)
        setNumberImage(Five)
        break
      case '6':
        setGenManaNumber(6)
        setNumberImage(Six)
        break
      case '7':
        setGenManaNumber(7)
        setNumberImage(Seven)
        break
      case '8':
        setGenManaNumber(8)
        setNumberImage(Eight)
        break
      case '9':
        setGenManaNumber(9)
        setNumberImage(Nine)
        break
      case '10':
        setGenManaNumber(10)
        setNumberImage(Ten)
        break
      case '11':
        setGenManaNumber(11)
        setNumberImage(Eleven)
        break
      case '12':
        setGenManaNumber(12)
        setNumberImage(Twelve)
        break
      case '13':
        setGenManaNumber(13)
        setNumberImage(Thirteen)
        break
      case '14':
        setGenManaNumber(14)
        setNumberImage(Fourteen)
        break
      case '15':
        setGenManaNumber(15)
        setNumberImage(Fifteen)
        break
      case '16':
        setGenManaNumber(16)
        setNumberImage(Sixteen)
        break
      case '17':
        setGenManaNumber(17)
        setNumberImage(Seventeen)
        break
      case '18':
        setGenManaNumber(18)
        setNumberImage(Eighteen)
        break
      case '19':
        setGenManaNumber(19)
        setNumberImage(Nineteen)
        break
      case '20':
        setGenManaNumber(20)
        setNumberImage(Twenty)
        break
    }
  };

  const buttonClick = () => {
    switch (radioSelection2) {
      case 'WhiteMana':
        setManas((prev) => {
          prev.push({
            src: WhiteMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        break
      case 'BlackMana':
        setManas((prev) => {
          prev.push({
            src: BlackMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        break
      case 'BlueMana':
        setManas((prev) => {
          prev.push({
            src: BlueMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        break
      case 'RedMana':
        setManas((prev) => {
          prev.push({
            src: RedMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
      case 'GreenMana':
        setManas((prev) => {
          prev.push({
            src: GreenMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
      case 'WhtBlkMana':
        setManas((prev) => {
          prev.push({
            src: WhtBlkMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
      case 'WhtBluMana':
        setManas((prev) => {
          prev.push({
            src: WhtBluMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
      case 'WhtGrnMana':
        setManas((prev) => {
          prev.push({
            src: WhtGrnMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
      case 'WhtRdMana':
        setManas((prev) => {
          prev.push({
            src: WhtRdMana,
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <img className='Mana' key={i} id={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
          checkButton()
          return manas
        })
        return
    }

  };

  const toggle = () => {
    setCheck(!checked)
  }

  const eraseMana = (e) => {
    let container = manas
    container.splice(e.target.id, 1)
    setManaImage(manas.map((x, i) => <img className='Mana' key={i} src={x.src} alt={x.alt} onClick={eraseMana} />))
    setDisable1(false)
  }

  const handleCardName = (e) => {
    setCardName(e.target.value)
  }

  const handleTextArea = (e) => {
    setTextArea(e.target.value)
  }

  const handleSubTypChange = (e) => {
    setSubType(e.target.value)
  }

  const powerChange = (e) => {

    if (e.target.id === 'attack') {
      setAttack(e.target.value)
    }
    else {
      setDefense(e.target.value)
    }
  }

  const checkButton = () => {
    console.log(manas.length)
    if (manas.length === 6) {
      setDisable1(true)
    }
  }

  const handleUploadedImage = (e) => {
    setTempImage(URL.createObjectURL(e.target.files[0]))
  }

  const changeImage = (e) => {
    e.preventDefault()
    setArtwork(<img className='CardImage' src={tempImage} alt='photo'></img>)
  }

  return (

    <div className='CardCreatorContainer'>
      <div className='RowContainer'>
        <div style={{ display: 'flex' }}>
          {artwork}
          <input
            type="text"
            maxLength={25}
            className='CardName'
            value={cardName}
            onChange={handleCardName}
          />
          <div className='ManaContainer'>
            {checked &&
              <img className='ManaNumber' src={numberImage} alt='Generic Number Icon'></img>
            }
            {manaImage}
          </div>
          <div className='CardTypeContainer'> {cardType}
            {needSub &&
              <input
                type="text"
                maxLength={20}
                className='SubTypeName'
                value={subType}
                onChange={handleSubTypChange}
              />
            }
          </div>
          <textarea className='TextAreaContainer' value={textArea} onChange={handleTextArea} />
          {!isDisabled2 &&
            <div className='PowerContainer'> {attack} / {defense} </div>
          }
          {isDisabled2 &&
            <div className='PowerContainer'> </div>
          }
          <img className='EmptyCard' src={cardImage} alt='Blank Card'></img>
        </div>

        <div className='CardEditor'>
          <h2 className='CardEditorTitle'>Card Editor</h2>
          <h4 className='CardColorHeader'>Card Color:</h4>
          <form style={{ textAlign: 'center' }}>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhiteCard"
                checked={radioSelection1 === "WhiteCard"}
                onChange={radioChange}
              />
              White
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="BlackCard"
                checked={radioSelection1 === "BlackCard"}
                onChange={radioChange}
              />
              Black
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="BlueCard"
                checked={radioSelection1 === "BlueCard"}
                onChange={radioChange}
              />
              Blue
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="RedCard"
                checked={radioSelection1 === "RedCard"}
                onChange={radioChange}
              />
              Red
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="GreenCard"
                checked={radioSelection1 === "GreenCard"}
                onChange={radioChange}
              />
              Green
            </label>
          </form>

          <h4 style={{ marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>Mana Color:<span>
            <input
              id='AddButton'
              className='Button'
              type="button"
              value="Add"
              disabled={isDisabled1}
              onClick={buttonClick}
            />
          </span></h4>
          <form style={{ textAlign: 'center' }}>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhiteMana"
                checked={radioSelection2 === "WhiteMana"}
                onChange={radioChange}
              />
              White
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="BlackMana"
                checked={radioSelection2 === "BlackMana"}
                onChange={radioChange}
              />
              Black
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="BlueMana"
                checked={radioSelection2 === "BlueMana"}
                onChange={radioChange}
              />
              Blue
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="RedMana"
                checked={radioSelection2 === "RedMana"}
                onChange={radioChange}
              />
              Red
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="GreenMana"
                checked={radioSelection2 === "GreenMana"}
                onChange={radioChange}
              />
              Green
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhtBlkMana"
                checked={radioSelection2 === "WhtBlkMana"}
                onChange={radioChange}
              />
              White/Black
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhtBluMana"
                checked={radioSelection2 === "WhtBluMana"}
                onChange={radioChange}
              />
              White/Blue
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhtGrnMana"
                checked={radioSelection2 === "WhtGrnMana"}
                onChange={radioChange}
              />
              White/Green
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="WhtRdMana"
                checked={radioSelection2 === "WhtRdMana"}
                onChange={radioChange}
              />
              White/Red
            </label>
          </form>

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Generic Mana?:
              <input
                type="checkbox"
                disabled={isDisabled2}
                checked={checked}
                onChange={toggle}
              />
            </label>
          </form>

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Generic Mana Count:
              <input
                className='Inputs'
                type="number"
                value={genManaNumber}
                disabled={isDisabled2}
                min={0}
                max={20}
                onChange={manaChange}
              />
            </label>
          </form>

          <h4 className='CardColorHeader'>Card Type:</h4>
          <form style={{ textAlign: 'center' }}>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Land"
                checked={radioSelection3 === "Land"}
                onChange={radioChange}
              />
              Land
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Creature"
                checked={radioSelection3 === "Creature"}
                onChange={radioChange}
              />
              Creature
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Enchantment"
                checked={radioSelection3 === "Enchantment"}
                onChange={radioChange}
              />
              Enchantment
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Artifact"
                checked={radioSelection3 === "Artifact"}
                onChange={radioChange}
              />
              Artifact
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Instant"
                checked={radioSelection3 === "Instant"}
                onChange={radioChange}
              />
              Instant
            </label>
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Sorcery"
                checked={radioSelection3 === "Sorcery"}
                onChange={radioChange}
              />
              Sorcery
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="react-tips"
                value="Artifact Creature"
                checked={radioSelection3 === "Artifact Creature"}
                onChange={radioChange}
              />
              Artifact Creature
            </label>
          </form>

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Attack:
              <input
                id='attack'
                className='Inputs'
                type="number"
                value={attack}
                disabled={isDisabled2}
                min={0}
                max={99}
                onChange={powerChange}
              />
            </label>
          </form>

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Defense:
              <input
                id='defense'
                className='Inputs'
                type="number"
                value={defense}
                disabled={isDisabled2}
                min={0}
                max={99}
                onChange={powerChange}
              />
            </label>
          </form>

          <form onSubmit={changeImage} style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Artwork:
              <input
                style={{ marginTop: '5px' }}
                type="file"
                accept='.jpeg, .png, .svg, .jpg'
                onChange={handleUploadedImage}
              />
            </label>
            <button id='SubmitButton' type='submit'>Update Image</button>
          </form>

          <div className='SaveButtonContainer'><button id='SaveButton'>Save</button></div>

        </div>
      </div>
      <div className='Filler'></div>
      <Footer />
    </div >

  )
}

export default CardCreator