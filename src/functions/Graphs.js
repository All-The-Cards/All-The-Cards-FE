
export function makeGraphs(stats) {

    console.log("All stats:", Object.keys(stats))

    let graphResults = {
        //average cost of all cards
        avg_cmc: "a",
        //average cost of all cards, excluding lands
        avg_cmc_no_lands: "b",
        //total cost of all cards
        total_cmc: "c",
        //percent of lands in deck
        land_percent: "d",
        //amount of lands in deck
        land_count: "e",
        //mana cost frequency, doesn't include lands
        mana_curve: "f",
        //number of cards in a color
        color_counts: "g",
        //percent of cards in a color
        color_percents: "h",
        //number of mana production
        mana_source_counts: "i",
        //percent of mana production
        mana_source_percents: "j",
        //total price of deck
        total_prices: "k",
        //amount of lands in deck
        card_types_counts: "l",
        //percent of cards in deck
        card_types_percents: "m"
    }

    Object.keys(stats).forEach((value, index) => {
        graphResults[value] = JSON.stringify(stats[value], null, '\n')
    })

    //avg_cmc

    //avg_cmc_no_lands

    //total_cmc

    //land_percent

    //land_count

    //mana_curve

    //color_counts

    //color_percents

    //mana_source_counts

    //mana_source_percents

    //total_prices

    //card_types_counts

    //card_types_percents



    return graphResults;
}