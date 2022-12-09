import { React, useState, useEffect, useContext } from 'react';
import Footer from '../components/Footer/Footer';
import { GlobalContext } from "../context/GlobalContext";
import * as mana from '../components/TextToMana/TextToMana.js'
import * as server from "../functions/ServerTalk";
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
  const [xImage, setXImage] = useState(false)
  const [isDisabled1, setDisable1] = useState(true)
  const [isDisabled2, setDisable2] = useState(true)
  const [checked1, setCheck1] = useState(false)
  const [checked2, setCheck2] = useState(false)
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
        setCardType('Creature')
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
        setCardType('Artifact Creature')
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

  const toggle = (e) => {

    if (e.target.id === 'NumberMana') {
      setCheck1(!checked1)
    }
    else if (e.target.id === 'XMana') {
      setCheck2(!checked2)
      setXImage(true)
    }

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
    if (checked1 && manas.length === 5) {
      setDisable1(true)
    }
    else if (!checked1 && manas.length === 6) {
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

  // Helper to convert cardImage to a dataURL object type.
  const toDataURL = img => fetch(img)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

  // Helper function to convert data URL to a file object.
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
    u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  function saveCard() {

    //get card object from state with mirrored structure of card object
    let customCardData = {
      card: buildCustomCard(),
      png: cardImage,
      art_crop: artwork.props.src,
      token: gc.activeSession != null && gc.activeSession.access_token != "" ? gc.activeSession.access_token : "",
      authorID: gc.activeSession != null && gc.activeSession.user.id != null ? gc.activeSession.user.id : "",
    }

    // Log card object
    console.log(customCardData)

    // Setup formData for server request
    const formData = new FormData()
    formData.append("art_crop", document.getElementById("userArtCrop").files[0]);
    formData.append("card", JSON.stringify(customCardData.card));

    // The cardImage is being converted to a dataURL object, then to a file object.
    toDataURL(cardImage).then(dataUrl => {
      var fileData = dataURLtoFile(dataUrl, "png.png")
      formData.append("png", fileData)
    })
    .then(data => {

    // The request is finally sent to the server
    fetch(server.buildAPIUrl("/api/features/editor/cards"),
      {
        method: 'POST',
        body: formData,
      }
    )
    .then(response => response.json())
    .then(response => console.log(response))
    .catch((error) => {
      console.log(error);
      return -1
    });

  })
    return 1
  }

  function getColorArray(manaString) {
    let colors = ['W', 'U', 'B', 'R', 'G']
    let foundColors = []
    for (let i = 0; i < manaString.length; i++) {
      if (colors.includes(manaString[i]) && !foundColors.includes(manaString[i])) {
        foundColors.push(manaString[i])
      }
    }
    return foundColors
  }

  function buildManaString(manaArray) {
    let manaString = ""
    if (genManaNumber > 0) {
      manaString += "{" + genManaNumber + "}"
    }
    for (let i = 0; i < manaArray.length; i++) {
      manaString += manaArray[i].src
    }
    return manaString
  }

  function getManaTotal(manaArray) {
    let total = 0
    if (genManaNumber > 0) {
      total += genManaNumber
    }
    total += manaArray.length
    return total
  }

  function buildCustomCard() {
    let manaString = buildManaString(manas)
    return {
      "id": null,
      "author": gc.activeSession != null && gc.activeSession.user.id != null ? gc.activeSession.user.id : "",
      "border_color": "black",
      "cmc": getManaTotal(manas), /*get mana total...need to include generic mana*/
      "color_identity": getColorArray(manaString),
      "colors": getColorArray(manaString),
      "flavor_text": null,
      "frame_effects": null,
      "mana_cost": manaString,
      "name": cardName,
      "oracle_text": textArea,
      "power": attack,
      "produced_mana": null,
      "rarity": "common",
      "subtype_one": subType,
      "toughness": defense,
      "type_one": cardType
    }
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
            {checked1 &&
              <div className='ManaNumber'>{numberImage}</div>
            }
            {xImage &&
              <div className='ManaNumber'>{mana.replaceSymbols("{X}")}</div>
            }
            {manaImage}
          </div>
          <div className='CardTypeContainer'> {cardType} {cardType.toLowerCase().includes('creature') && ' - '}
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
          <div className='TextAreaContainer' style={{ whiteSpace: "pre-line", flexDirection: 'row' }}>
            {mana.replaceSymbols(textArea)}
          </div>
          {!isDisabled2 &&
            <div className='PowerContainer'> {attack} / {defense} </div>
          }
          {isDisabled2 &&
            <div className='PowerContainer'> </div>
          }
          <img className='EmptyCard' src={cardImage} id="userPng" alt='Blank Card'></img>
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

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Numeric Mana?:
              <input
                id='NumberMana'
                type="checkbox"
                disabled={isDisabled2}
                checked={checked1}
                onChange={toggle}
              />
            </label>
          </form>

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              X Symbol?:
              <input
                id='XMana'
                type="checkbox"
                disabled={isDisabled2}
                checked={checked2}
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

          <form style={{ fontWeight: 'bold', marginLeft: '10px', marginBottom: '5px', marginTop: '5px' }}>
            <label>
              Description:
            </label>
            <br />
            <textarea className='TextAreaContainerEditor' value={textArea} onChange={handleTextArea} />
          </form>

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
                id="userArtCrop"
                style={{ marginTop: '5px' }}
                type="file"
                accept='.jpeg, .png, .svg, .jpg'
                onChange={handleUploadedImage}
              />
            </label>
            <button id='SubmitButton' type='submit'>Update Image</button>
          </form>

          <div className='SaveButtonContainer'><button id='SaveButton' onClick={saveCard}>Save</button></div>

        </div>
      </div>
      <div className='Filler'></div>
    </div >

  )
}

export default CardCreator