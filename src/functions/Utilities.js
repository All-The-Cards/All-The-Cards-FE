export function mapCardsToTypes(unsortedCards) {
    //unsortedCards is assumed to be an array of card objects
    //what we want our result to look like is an array of objects, which holds the category name and a list of all cards that belong to it
    let results = []
    
    unsortedCards.forEach(card => {
        if(card.type_one.toLowerCase().includes("creature")) {
            card.type_one = "Creature"
        }
        let i = results.findIndex(object => {
            return object.type === card.type_one
        })
        if (i <= -1) {
            results.push({type: card.type_one, cards: [card]})
        }
        else {
            results[i].cards.push(card)
        }
    });

    return results;
}