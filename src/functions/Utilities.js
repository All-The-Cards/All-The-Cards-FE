export function mapCardsToTypes(unsortedCards) {
    //unsortedCards is assumed to be an array of card objects
    //what we want our result to look like is an array of objects, which holds the category name and a list of all cards that belong to it
    let results = []

    if (unsortedCards.length > 0) {
        unsortedCards.forEach(card => {
            if (card.type_one.toLowerCase().includes("creature")) {
                card.type_one = "Creature"
            }
            let i = results.findIndex(object => {
                return object.type === card.type_one
            })
            if (i <= -1) {
                results.push({ type: card.type_one, cards: [card] })
            }
            else {
                results[i].cards.push(card)
            }
        });
    }
    // results = unsortedCards

    return results;
}

export function getProperFormatName(format) {
    let correctFormat = "<format>"

    switch (format) {
        case "standard":
            correctFormat = "Standard"
            break;
        case "commander":
            correctFormat = "Commander"
            break;
        case "pioneer":
            correctFormat = "Pioneer"
            break;
        case "explorer":
            correctFormat = "Explorer"
            break;
        case "modern":
            correctFormat = "Modern"
            break;
        case "premodern":
            correctFormat = "Premodern"
            break;
        case "vintage":
            correctFormat = "Vintage"
            break;
        case "legacy":
            correctFormat = "Legacy"
            break;
        case "oldschool":
            correctFormat = "Old School"
            break;
        case "pauper":
            correctFormat = "Pauper"
            break;
        case "historic":
            correctFormat = "Historic"
            break;
        case "alchemy":
            correctFormat = "Alchemy"
            break;
        case "brawl":
            correctFormat = "Brawl"
            break;
        case "paupercommander":
            correctFormat = "Pauper Commander"
            break;
        case "historicbrawl":
            correctFormat = "Historic Brawl"
            break;
        case "penny":
            correctFormat = "Penny Dreadful"
            break;
        case "duel":
            correctFormat = "Duel"
            break;
        case "future":
            correctFormat = "Future"
            break;
        case "gladiator":
            correctFormat = "Gladiator"
            break;
    }

    return correctFormat
}

export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromLocalStorage(key) {
    let data = localStorage.getItem(key)
    if (data) {
        data = JSON.parse(data)
    }
    return data
}