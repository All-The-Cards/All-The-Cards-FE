// This file contains utilities to display Mana symbols from text items
import { Mana } from "@saeris/react-mana";

// Replaces a string of Mana symbols with Mana icons
// Parameters:
//     rawMana (string) - "{4}{R}{R}"
// Returns: array - [<Mana.../>, <Mana.../>]
//
export function generateSymbols(rawMana){
    // console.log(rawMana)
    let symbols = []

    let allCounts = []
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
                    ]
    
    for (let i = 0; i < validChars.length; i++){
        allCounts[i] = (rawMana.match(new RegExp(validChars[i], "g") || []))
        if (allCounts[i]) allCounts[i] = allCounts[i].length
        else allCounts[i] = 0
    }
    let key = 0
    for (let i = 0; i < allCounts.length; i++){

        for (let k = 0; k < allCounts[i]; k++){
            symbols.push(<Mana symbol={charCodes[i]} cost="true" shadow fixed key={key++}></Mana>)
        }
    }

    let symbolsElement = <div>{symbols}</div>
    return symbolsElement

}