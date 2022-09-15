// This file contains utilities to display Mana symbols from text items
import { Mana } from "@saeris/react-mana";
let validChars = [
    "{[0]}", "{[1]}", "{[2]}", "{[3]}", "{[4]}",
    "{[5]}", "{[6]}", "{[7]}", "{[8]}", "{[9]}",
    "{[1][0]}", "{[1][1]}", "{[1][2]}", "{[1][3]}", "{[1][4]}",
    "{[1][5]}", "{[1][6]}", "{[1][7]}", "{[1][8]}", "{[1][9]}",
    "{[2][0]}", "{X}", "{Y}", "{Z}",
    "{W/U}","{W/B}","{U/B}","{U/R}","{B/R}",
    "{B/G}","{R/G}","{R/W}","{G/W}","{G/U}",
    "{[2]/W}","{[2]/U}","{[2]/B}","{[2]/R}","{[2]/G}",
    "{W}","{U}","{B}","{R}","{G}", "{C}", "{S}",
    "{W/P}","{U/P}","{B/P}","{R/P}","{G/P}", "{P}",
    "{T}", "{Q}"
]
let charCodes = [
    "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9",
    "10", "11", "12", "13", "14",
    "15", "16", "17", "18", "19",
    "20", "x", "y", "z",
    "wu","wb","ub","ur","br",
    "bg","rg","rw","gw","gu",
    "2w","2u","2b","2r","2g",
    "w","u","b","r","g", "c", "s",
    "wp","up","bp","rp","gp", "p",
    "tap", "untap"
]

// DEPRECATED 
// Replaces a string of Mana symbols with Mana icons
// Parameters:
//     rawMana (string) - "{4}{R}{R}"
// Returns: array - [<Mana.../>, <Mana.../>]
//
// export function generateSymbols(rawMana){
//     if (rawMana === null) return
//     // console.log(rawMana)
//     let symbols = []
//     let allCounts = []
    
//     //find frequency symbols from string
//     for (let i = 0; i < validChars.length; i++){
//         allCounts[i] = (rawMana.match(new RegExp(validChars[i], "g") || []))
//         if (allCounts[i]) allCounts[i] = allCounts[i].length
//         else allCounts[i] = 0
//     }

//     let key = 0
//     //create the array of symbols
//     for (let i = 0; i < allCounts.length; i++){
//         for (let k = 0; k < allCounts[i]; k++){
//             symbols.push(<Mana symbol={charCodes[i]} cost="true" shadow fixed key={key++}></Mana>)
//         }
//     }

//     let symbolsElement = <div>{symbols}</div>
//     return symbolsElement

// }

// Replaces symbols in a string with icons
// Parameters:
//     rawMana (string) - "{T}: Add one mana..."
// Returns: JSX Object <><Mana.../><>: Add one mana...</></>
//
export function replaceSymbols(text){
    if (text === null) return
    let jsxObjs = []
    //split text by both { and } which puts the mana tags seperate
    let splitText = text.split(/{|}/)
    //remove empty
    splitText = splitText.filter(x => { return x !== "" })

    for (let i = 0; i < splitText.length; i++){
        //if the split item matches a valid char
        if (validChars.find(el => {
            //hardcoded annoying edge case
            if (el.includes(splitText[i]) || splitText[i] == "2/W"|| splitText[i] == "2/U"|| splitText[i] == "2/B"|| splitText[i] == "2/R"|| splitText[i] == "2/G" 
            || splitText[i] =="10"|| splitText[i] =="11"|| splitText[i] =="12"|| splitText[i] =="13"|| splitText[i] =="14"|| splitText[i] =="15"
            || splitText[i] =="16"|| splitText[i] =="17"|| splitText[i] =="18"|| splitText[i] =="19"|| splitText[i] =="20"
            )
            return true
        }) ) {
            //replace nums with [x] for regexing
            let builtStr = splitText[i]
            let regex = /(\d)/
            if (builtStr.match(regex)) {
                builtStr = builtStr.replace(regex, "[" +  /$1/ + "]")
                builtStr = builtStr.replaceAll("/", "")
            }
            //hardcoded annoying edge case
            if (builtStr === "[2]W") builtStr = "[2]/W"
            if (builtStr === "[2]U") builtStr = "[2]/U"
            if (builtStr === "[2]B") builtStr = "[2]/B"
            if (builtStr === "[2]R") builtStr = "[2]/R"
            if (builtStr === "[2]G") builtStr = "[2]/G"
            if (builtStr === "[1]0") builtStr = "[1][0]"
            if (builtStr === "[1]1") builtStr = "[1][1]"
            if (builtStr === "[1]2") builtStr = "[1][2]"
            if (builtStr === "[1]3") builtStr = "[1][3]"
            if (builtStr === "[1]4") builtStr = "[1][4]"
            if (builtStr === "[1]5") builtStr = "[1][5]"
            if (builtStr === "[1]6") builtStr = "[1][6]"
            if (builtStr === "[1]7") builtStr = "[1][7]"
            if (builtStr === "[1]8") builtStr = "[1][8]"
            if (builtStr === "[1]9") builtStr = "[1][9]"
            if (builtStr === "[2]0") builtStr = "[2][0]"
            //surround in tag for mana
            let fullChars = "{" + builtStr + "}"
            // console.log(fullChars)
            jsxObjs.push(<div key={i} style={{display:"inline"}}><Mana symbol={charCodes[validChars.indexOf(fullChars)]} cost="true" shadow/></div>)
        }
        else {
            jsxObjs.push(<div key={i} style={{display:"inline", marginLeft: '2px'}}>{splitText[i]}</div>)
        }
    }

    return jsxObjs
}