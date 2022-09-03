export function mapCardsToTypes(unsortedCards) {
    //unsortedCards is assumed to be an array of card objects
    //what we want our result to look like is an array of objects, which holds the category name and a list of all cards that belong to it
    let results = []
    
    unsortedCards.forEach(card => {
        let i = results.findIndex(object => {
            return object.type === card.type_line
        })
        if (i <= -1) {
            results.push({type: card.type_line, cards: [card]})
        }
        else {
            results[i].cards.push(card)
        }
    });

    return results;
}