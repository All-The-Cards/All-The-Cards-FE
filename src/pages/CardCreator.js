import { React, useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer/Footer';
import { GlobalContext } from "../context/GlobalContext";
import * as mana from '../components/TextToMana/TextToMana.js'
import './CardCreator.css'

// Empty Cards
import WhiteCard from '../images/MTG-WhiteCard.png'
import BlackCard from '../images/MTG-BlackCard.png'
import BlueCard from '../images/MTG-BlueCard.png'
import RedCard from '../images/MTG-RedCard.png'
import GreenCard from '../images/MTG-GreenCard.png'

// Images
import Default from '../images/DefaultImage.jpg'

const CardCreator = (props) => {

  const gc = useContext(GlobalContext)
  const [cardImage, setCardImage] = useState(WhiteCard)
  const [artwork, setArtwork] = useState(<img className='CardImage' src={Default} alt='photo'></img>)
  const [tempImage, setTempImage] = useState(null)
  const [cardName, setCardName] = useState('Card Name')
  const [manaImage, setManaImage] = useState()
  const [numberImage, setNumberImage] = useState(mana.replaceSymbols("{0}"))
  const [isDisabled1, setDisable1] = useState(true)
  const [isDisabled2, setDisable2] = useState(true)
  const [checked, setCheck] = useState(false)
  const [cardType, setCardType] = useState('Land')
  const [selectValue, setSelectValue] = useState('land')
  const [subType, setSubType] = useState('Subtype Name')
  const [needSub, setSub] = useState(false)
  const [textArea, setTextArea] = useState('Card Description Here...')
  const [attack, setAttack] = useState(0)
  const [defense, setDefense] = useState(0)
  const [radioSelection1, setRadioSelection1] = useState('WhiteCard')
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
      default:
        return
    }
  };

  const selectChange = (e) => {
    let value = e.target.value
    setSelectValue(value)

    switch (value) {
      case 'land':
        setCardType('Land')
        setSub(false)
        setDisable1(true)
        setDisable2(true)
        break
      case 'creature':
        setCardType('Creature -')
        setSub(true)
        setDisable1(false)
        setDisable2(false)
        break
      case 'enchantment':
        setCardType('Enchantment')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'artifact':
        setCardType('Artifact')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'instant':
        setCardType('Instant')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'sorcery':
        setCardType('Sorcery')
        setSub(false)
        setDisable1(false)
        setDisable2(false)
        break
      case 'aCreature':
        setCardType('Artifact Creature -')
        setSub(true)
        setDisable1(false)
        setDisable2(false)
        break
      default:
        return
    }
  };

  const manaChange = (event) => {
    let target = event.target.value
    console.log(target)

    switch (target) {
      case '0':
        setGenManaNumber(0)
        setNumberImage(mana.replaceSymbols("{0}"))
        break
      case '1':
        setGenManaNumber(1)
        setNumberImage(mana.replaceSymbols("{1}"))
        break
      case '2':
        setGenManaNumber(2)
        setNumberImage(mana.replaceSymbols("{2}"))
        break
      case '3':
        setGenManaNumber(3)
        setNumberImage(mana.replaceSymbols("{3}"))
        break
      case '4':
        setGenManaNumber(4)
        setNumberImage(mana.replaceSymbols("{4}"))
        break
      case '5':
        setGenManaNumber(5)
        setNumberImage(mana.replaceSymbols("{5}"))
        break
      case '6':
        setGenManaNumber(6)
        setNumberImage(mana.replaceSymbols("{6}"))
        break
      case '7':
        setGenManaNumber(7)
        setNumberImage(mana.replaceSymbols("{7}"))
        break
      case '8':
        setGenManaNumber(8)
        setNumberImage(mana.replaceSymbols("{8}"))
        break
      case '9':
        setGenManaNumber(9)
        setNumberImage(mana.replaceSymbols("{9}"))
        break
      case '10':
        setGenManaNumber(10)
        setNumberImage(mana.replaceSymbols("{10}"))
        break
      case '11':
        setGenManaNumber(11)
        setNumberImage(mana.replaceSymbols("{11}"))
        break
      case '12':
        setGenManaNumber(12)
        setNumberImage(mana.replaceSymbols("{12}"))
        break
      case '13':
        setGenManaNumber(13)
        setNumberImage(mana.replaceSymbols("{13}"))
        break
      case '14':
        setGenManaNumber(14)
        setNumberImage(mana.replaceSymbols("{14}"))
        break
      case '15':
        setGenManaNumber(15)
        setNumberImage(mana.replaceSymbols("{15}"))
        break
      case '16':
        setGenManaNumber(16)
        setNumberImage(mana.replaceSymbols("{16}"))
        break
      case '17':
        setGenManaNumber(17)
        setNumberImage(mana.replaceSymbols("{17}"))
        break
      case '18':
        setGenManaNumber(18)
        setNumberImage(mana.replaceSymbols("{18}"))
        break
      case '19':
        setGenManaNumber(19)
        setNumberImage(mana.replaceSymbols("{19}"))
        break
      case '20':
        setGenManaNumber(20)
        setNumberImage(mana.replaceSymbols("{20}"))
        break
      default:
        return
    }
  };

  const buttonClick = (e) => {

    if (isDisabled1) return

    switch (e.target.title) {
      case 'White':
        setManas((prev) => {
          prev.push({
            src: "{W}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        break
      case 'Black':
        setManas((prev) => {
          prev.push({
            src: "{B}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        break
      case 'Blue':
        setManas((prev) => {
          prev.push({
            src: "{U}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        break
      case 'Red':
        setManas((prev) => {
          prev.push({
            src: "{R}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Green':
        setManas((prev) => {
          prev.push({
            src: "{G}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'White/Black':
        setManas((prev) => {
          prev.push({
            src: "{W/B}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Blue/Black':
        setManas((prev) => {
          prev.push({
            src: "{U/B}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Black/Red':
        setManas((prev) => {
          prev.push({
            src: "{B/R}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Red/Green':
        setManas((prev) => {
          prev.push({
            src: "{R/G}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Green/White':
        setManas((prev) => {
          prev.push({
            src: "{G/W}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Blue/Red':
        setManas((prev) => {
          prev.push({
            src: "{U/R}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Black/Green':
        setManas((prev) => {
          prev.push({
            src: "{B/G}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Red/White':
        setManas((prev) => {
          prev.push({
            src: "{R/W}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      case 'Green/Blue':
        setManas((prev) => {
          prev.push({
            src: "{G/U}",
            alt: 'Mana Symbol'
          })
          setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
          checkButton()
          return manas
        })
        return
      default:
        return
    }

  };

  const toggle = () => {
    setCheck(!checked)
  }

  const eraseMana = (e) => {
    let container = manas
    container.splice(e.target.parentElement.parentElement.id, 1)
    setManaImage(manas.map((x, i) => <div className='Mana' id={i} key={i} alt={x.alt} onClick={eraseMana}>{mana.replaceSymbols(x.src)}</div>))
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
    if (checked && manas.length === 5) {
      setDisable1(true)
    }
    else if (!checked && manas.length === 6) {
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
              // <img className='ManaNumber' src={numberImage} alt='Generic Number Icon'></img>
              <div className='ManaNumber'>{numberImage}</div>
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

          <h4 style={{ marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>Mana Color:</h4>
          {/* <input
              id='AddButton'
              className='Button'
              type="button"
              value="Add"
              disabled={isDisabled1}
              onClick={buttonClick}
            /> */}
          <div className='RealManaContainer'>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{W}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{B}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{U}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{R}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{G}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{W/B}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{U/B}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{B/R}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{R/G}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{G/W}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{U/R}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{B/G}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{R/W}")}</div>
            <div className='RealMana' onClick={buttonClick} disabled={isDisabled1}>{mana.replaceSymbols("{G/U}")}</div>
          </div>

          {/* <form style={{ textAlign: 'center' }}>
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
          </form>*/}

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
          <select className='SelectContainer' value={selectValue} onChange={selectChange}>
            <option value='land'>Land</option>
            <option value='creature'>Creature</option>
            <option value='enchantment'>Enchantment</option>
            <option value='artifact'>Artifact</option>
            <option value='instant'>Instant</option>
            <option value='sorcery'>Sorcery</option>
            <option value='cArtifact'>Creature Artifact</option>
          </select>

          {/* <form style={{ textAlign: 'center' }}>
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
          </form> */}

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
              <label>
                Power:
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
                Toughness:
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
          </div>

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