
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
        //amount of lands in deck
        land_count: 0,
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
        color_counts: {
            w: 0,
            u: 0,
            b: 0,
            r: 0,
            g: 0,
            c: 0,
        },
        //percent of cards in a color
        color_percents: {
            w: 0,
            u: 0,
            b: 0,
            r: 0,
            g: 0,
            c: 0,
        },
        //number of mana production
        mana_source_counts: {
            w: 0,
            u: 0,
            b: 0,
            r: 0,
            g: 0,
            c: 0,
        },
        //percent of mana production
        mana_source_percents: {
            w: 0,
            u: 0,
            b: 0,
            r: 0,
            g: 0,
            c: 0,
        },
        //total price of deck
        total_prices: {
            usd: 0,
            eur: 0,
            tix: 0,
        },
        //amount of lands in deck
        card_types_counts: {
            creature: 0,
            instant: 0,
            sorcery: 0,
            enchantment: 0,
            artifact: 0,
            planeswalker: 0,
            land: 0,
        },
        //percent of cards in deck
        card_types_percents: {
            creature: 0,
            instant: 0,
            sorcery: 0,
            enchantment: 0,
            artifact: 0,
            planeswalker: 0,
            land: 0,
        },
        mana_ratio: {
            colors: 0,
            sources: 0,
        }
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
    statResults.avg_cmc = Math.round(avg_cmc * 100) / 100

    //avg_cmc_no_lands

    let deck_no_lands = deck.filter((item) => {
        return !item.type_one.toLowerCase().includes("Land".toLowerCase())
    })
    let dnl = deck_no_lands
    let avg_cmc_no_lands = statResults.total_cmc / deck_no_lands.length
    statResults.avg_cmc_no_lands = Math.round(avg_cmc_no_lands * 100) / 100

    //land_percent

    let deck_only_lands = deck.filter((item) => {
        return item.type_one.toLowerCase().includes("Land".toLowerCase())
    })
    let dol = deck_only_lands
    let land_percent = deck_only_lands.length / deck.length
    statResults.land_percent = Math.round(land_percent * 100) / 100
    statResults.land_count = dol.length

    //deck no basic lands 
    let deck_no_basics = deck.filter((item) => {
        return !item.type_one.toLowerCase().includes("Basic Land".toLowerCase())
    })
    let dnb = deck_no_basics

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

    let colors = ['w', 'u', 'b', 'r', 'g', 'c']
    let color_counts = {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        c: 0,
    }

    for (let i = 0; i < dnl.length; i++){
        if (dnl[i].color_identity){
            if (dnl[i].color_identity == "[]") {
                color_counts['c']++
            }
            else {
                for (let k = 0; k < colors.length; k++) {
                    if (deck[i].color_identity.toLowerCase().includes(colors[k])) {
                        color_counts[colors[k]]++
                    }
                }
            }
        }
        else {

        }
    }

    statResults.color_counts = color_counts

    //color_percents

    let color_percents = {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        c: 0,
    }

    for (let i = 0; i < colors.length; i++){
        color_percents[colors[i]] = Math.round(color_counts[colors[i]] / dnl.length * 100) / 100
    }
    statResults.color_percents = color_percents

    //mana_source_counts

    let mana_source_counts = {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        c: 0,
    }
    let mana_source_counts_sum = 0
    for (let i = 0; i < deck.length; i++){
        if (deck[i].produced_mana){
            mana_source_counts_sum++
            for (let k = 0; k < colors.length; k++) {
                if (deck[i].produced_mana.toLowerCase().includes(colors[k])) {
                    mana_source_counts[colors[k]]++
                }
            }
        }
        else {

        }
    }

    statResults.mana_source_counts = mana_source_counts

    //mana_source_percents

    let mana_source_percents = {
        w: 0,
        u: 0,
        b: 0,
        r: 0,
        g: 0,
        c: 0,
    }

    if (mana_source_counts_sum > 0) {
        for (let i = 0; i < colors.length; i++){
            mana_source_percents[colors[i]] =  Math.round(mana_source_counts[colors[i]] / mana_source_counts_sum * 100) / 100
        }
    }

    statResults.mana_source_percents = mana_source_percents

    //total_prices

    let total_prices = {
        usd: 0,
        eur: 0,
        tix: 0,
    }

    for (let i = 0; i < dnb.length; i++){
        if (dnb[i].prices){
            //add usd price if available
            if (dnb[i].prices.usd || dnb[i].prices.usd_foil){
                if (dnb[i].prices.usd){
                    total_prices.usd += parseFloat(dnb[i].prices.usd)
                }
                else if (dnb[i].prices.usd_foil){
                    total_prices.usd += parseFloat(dnb[i].prices.usd_foil)
                }
            }
            //add eur price if available
            if (dnb[i].prices.eur || dnb[i].prices.eur_foil){
                if (dnb[i].prices.eur){
                    total_prices.eur += parseFloat(dnb[i].prices.eur)
                }
                else if (dnb[i].prices.eur_foil){
                    total_prices.eur += parseFloat(dnb[i].prices.eur_foil)
                }
            }
            //add tix price if available
            if (dnb[i].prices.tix){
                total_prices.tix += parseFloat(dnb[i].prices.tix)
            }
        }
    }

    total_prices.usd = total_prices.usd.toFixed(2)
    total_prices.eur = total_prices.eur.toFixed(2)
    total_prices.tix = total_prices.tix.toFixed(2)
    statResults.total_prices = total_prices

    //card_types_counts

    let card_types = [
        'creature',
        'instant',
        'sorcery',
        'enchantment',
        'artifact',
        'planeswalker',
        'land' 
    ]
        
    let type_counts = {
        creature: 0,
        instant: 0,
        sorcery: 0,
        enchantment: 0,
        artifact: 0,
        planeswalker: 0,
        land: 0,
    }

    for (let i = 0; i < deck.length; i++){
        for (let k = 0; k < card_types.length; k++){
            if (deck[i].type_one.toLowerCase().includes(card_types[k])) {
                type_counts[card_types[k]]++
            }
        }
    }

    statResults.card_types_counts = type_counts

    //card_types_percents

    let type_percents = {
        creature: 0,
        instant: 0,
        sorcery: 0,
        enchantment: 0,
        artifact: 0,
        planeswalker: 0,
        land: 0,
    }
    
    for (let i = 0; i < card_types.length; i++){
        type_percents[card_types[i]] = Math.round(type_counts[card_types[i]] / deck.length * 100) / 100
    }

    statResults.card_types_percents = type_percents

    //mana_ratio

    statResults.mana_ratio = {
        colors: color_counts,
        sources: mana_source_counts
    }

    return statResults;
}