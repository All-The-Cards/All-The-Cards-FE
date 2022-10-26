export function getDeckStats(deck) {
    let statResults = {
        //average cost of all cards
        avg_cmc: 0,
        //average cost of all cards, excluding lands
        avg_cmc_no_lands: 0,
        //total cost of all cards
        total_cmc: 0,
        //percent of lands in deck
        land_percent: 0,
        //mana cost frequency, doesn't include lands
        mana_curve: [
            0, //0
            0, //1
            0, //2
            0, //3
            0, //4
            0, //5
            0, //6
            0, //7
            0, //8+
        ],
        //number of cards in a color
        color_counts: [
            0, //w
            0, //u
            0, //b
            0, //r
            0, //g
            0, //c
        ],
        //percent of cards in a color
        color_percents: [
            0, //w
            0, //u
            0, //b
            0, //r
            0, //g
            0, //c
        ],
        //number of mana production
        mana_source_counts: [
            0, //w
            0, //u
            0, //b
            0, //r
            0, //g
            0, //c
        ],
        //percent of mana production
        mana_source_percents: [
            0, //w
            0, //u
            0, //b
            0, //r
            0, //g
            0, //c
        ],
    }
    //base stats

    //total_cmc
    let sumOfCMC = 0;
    for (let i = 0; i < deck.length; i++){
        if (deck[i].cmc){
            sumOfCMC += parseInt(deck[i].cmc)
        }
    }

    statResults.total_cmc = sumOfCMC

    //avg_cmc

    let avg_cmc = statResults.total_cmc / deck.length
    statResults.avg_cmc = avg_cmc

    //avg_cmc_no_lands

    let deck_no_lands = deck.filter((item) => {
        return !item.type_one.toLowerCase().includes("Land".toLowerCase())
    })
    let dnl = deck_no_lands
    let avg_cmc_no_lands = statResults.total_cmc / deck_no_lands.length
    statResults.avg_cmc_no_lands = avg_cmc_no_lands

    //land_percent

    let deck_only_lands = deck.filter((item) => {
        return item.type_one.toLowerCase().includes("Land".toLowerCase())
    })
    let dol = deck_only_lands
    let land_percent = deck_only_lands.length / deck.length
    statResults.land_percent = land_percent

    //mana_curve

    let mana_curve = [0,0,0,0,0,0,0,0,0]
    for (let i = 0; i < dnl.length; i++){
        if (dnl[i].cmc){
            if (dnl[i].cmc < 8) {
                mana_curve[parseInt(dnl[i].cmc)]++
            }
            else if (dnl[i].cmc >= 8){
                mana_curve[8]++
            }
        }
        else {
            mana_curve[0]++
        }
    }

    statResults.mana_curve = mana_curve

    //color_counts

    let color_counts = [0,0,0,0,0,0]
    for (let i = 0; i < dnl.length; i++){
        if (dnl[i].color_identity){
            if (dnl[i].color_identity == "[]") {
                color_counts[5]++
            }
            else {
                for (let k = 0; k < dnl[i].color_identity.length; k++){
                    switch (dnl[i].color_identity[k]) {
                        case 'W':
                            color_counts[0]++
                            break
                        case 'U':
                            color_counts[1]++
                            break
                        case 'B':
                            color_counts[2]++
                            break
                        case 'R':
                            color_counts[3]++
                            break
                        case 'G':
                            color_counts[4]++
                            break
                                                
                    }
                }
            }
        }
        else {

        }
    }

    statResults.color_counts = color_counts

    //color_percents

    let color_percents = [0,0,0,0,0,0]

    for (let i = 0; i < color_counts.length; i++){
        color_percents[i] = color_counts[i] / dnl.length
    }
    
    statResults.color_percents = color_percents

    //mana_source_counts

    let mana_source_counts = [0,0,0,0,0,0]
    let mana_source_counts_sum = 0
    for (let i = 0; i < deck.length; i++){
        if (deck[i].produced_mana){
            mana_source_counts_sum++
            for (let k = 0; k < deck[i].produced_mana.length; k++){
                switch (deck[i].produced_mana[k]) {
                    case 'W':
                        mana_source_counts[0]++
                        break
                    case 'U':
                        mana_source_counts[1]++
                        break
                    case 'B':
                        mana_source_counts[2]++
                        break
                    case 'R':
                        mana_source_counts[3]++
                        break
                    case 'G':
                        mana_source_counts[4]++
                        break
                    case 'C':
                        mana_source_counts[5]++
                        break
                                            
                }
            }
        }
        else {

        }
    }

    statResults.mana_source_counts = mana_source_counts

    //mana_source_percents

    let mana_source_percents = [0,0,0,0,0,0]

    if (mana_source_counts_sum > 0) {
        for (let i = 0; i < mana_source_counts.length; i++){
            mana_source_percents[i] = mana_source_counts[i] / mana_source_counts_sum
        }
    }

    statResults.mana_source_percents = mana_source_percents


    return statResults;
}