
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

export function makeGraphs(stats) {

    // console.log("All stats:", Object.keys(stats))
    
    // OBJECT MAP EXAMPLE:
    // let data = []
    // Object.values(stats["key"]).forEach((item, index) => {
    //     data.push({
    //         name: Object.keys(stats["key"])[index],
    //         count: item
    //     })
    // })

    // ARRAY MAP EXAMPLE:
    // let data = stats["key"].map((item, index) => {
    //     return {
    //         name: index,
    //         count: item
    //     }
    // })
    let gHeight = 250;
    let gWidth = 400;

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
        //sum of mana production
        mana_source_count: "i",
        //number of mana production
        mana_source_counts: "j",
        //percent of mana production
        mana_source_percents: "k",
        //total price of deck
        total_prices: "l",
        //amount of lands in deck
        card_types_counts: "m",
        //percent of cards in deck
        card_types_percents: "n",
        //ratio of producers to costs
        mana_ratio: "o"
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

    let mana_curve_data = stats["mana_curve"].map((item, index) => {
        let num = index
        if (num > 7) num = "8+"
        return {
            cost: num,
            count: item,
            fill: "#DB1E4F",
        }
    })
    graphResults.mana_curve = <ComposedChart
        width={gWidth}
        height={gHeight}
        data={mana_curve_data}
        margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
        }}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cost" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="count"/>
        <Line type="monotone" dataKey="count" stroke="#7138D1" activeDot={{ r: 5 }} />
    </ComposedChart>

    //color_counts
    
    let color_counts_data = []
    
    Object.values(stats["color_counts"]).forEach((item, index) => {
        let fill = getColor(Object.keys(stats["color_counts"])[index])
        let name = getName(Object.keys(stats["color_counts"])[index])
        
        if (item > 0) {
            color_counts_data.push({
                name: name + " mana costs",
                count: item,
                fill: fill
            })
        }
    })

    graphResults.color_counts = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="count"
        isAnimationActive={false}
        data={color_counts_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //color_percents
    
    let color_percents_data = []
    Object.values(stats["color_percents"]).forEach((item, index) => {
    
        let fill = getColor(Object.keys(stats["color_percents"])[index])
        let name = getName(Object.keys(stats["color_percents"])[index])

        if (item > 0) {
            color_percents_data.push({
                name: name + " card %",
                percent: item,
                fill: fill
            })
        }
    })

    graphResults.color_percents = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="percent"
        isAnimationActive={false}
        data={color_percents_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //mana_source_counts

    let mana_source_counts_data = []
    Object.values(stats["mana_source_counts"]).forEach((item, index) => {
    
        let fill = getColor(Object.keys(stats["mana_source_counts"])[index])
        let name = getName(Object.keys(stats["mana_source_counts"])[index])

        if (item > 0) {
            mana_source_counts_data.push({
                name: name + " mana sources",
                fill: fill,
                count: item
            })
        }
    })
    
    graphResults.mana_source_counts = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="count"
        isAnimationActive={false}
        data={mana_source_counts_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //mana_source_percents

    let mana_source_percents_data = []
    Object.values(stats["mana_source_percents"]).forEach((item, index) => {
    
        let fill = getColor(Object.keys(stats["mana_source_percents"])[index])
        let name = getName(Object.keys(stats["mana_source_percents"])[index])

        if (item > 0) {
            mana_source_percents_data.push({
                name: name + " mana sources %",
                fill: fill,
                percent: item
            })
        }
    })
    
    graphResults.mana_source_percents = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="percent"
        isAnimationActive={false}
        data={mana_source_percents_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //total_prices

    //card_types_counts

    let card_types_counts_data = []
    Object.values(stats["card_types_counts"]).forEach((item, index) => {
        
        let fill = getColor(Object.keys(stats["card_types_counts"])[index])
        let name = getName(Object.keys(stats["card_types_counts"])[index])

        if (item > 0) {
            card_types_counts_data.push({
                name: name,
                fill: fill,
                count: item
            })
        }
    })
    
    graphResults.card_types_counts = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="count"
        isAnimationActive={false}
        data={card_types_counts_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //card_types_percents
    let card_types_percents_data = []
    Object.values(stats["card_types_percents"]).forEach((item, index) => {
    
        let fill = getColor(Object.keys(stats["card_types_counts"])[index])
        let name = getName(Object.keys(stats["card_types_counts"])[index])

        if (item > 0) {
            card_types_percents_data.push({
                name: name + " %",
                fill: fill,
                percent: item
            })
        }
    })
    
    graphResults.card_types_percents = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie
        dataKey="percent"
        isAnimationActive={false}
        data={card_types_percents_data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label
        />
        <Tooltip />
    </PieChart>

    //mana_ratio

    graphResults.mana_ratio = <PieChart 
        width={gWidth} 
        height={gHeight}
    >
        <Pie data={mana_source_counts_data} dataKey="count" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
        <Pie data={color_counts_data} dataKey="count" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
        
        <Tooltip />
    </PieChart>

    return graphResults;
}

const getColor = (symbol) => {
    let color = "#c4c4c4"
    let color2 = "#c6bdbd"

    switch(symbol){
        case 'w':
            color = "#ebe6d9"
            break;
        case 'u':
            color = "#c5d6eb"
            break;
        case 'b':
            color = "#bab7b9"
            break;
        case 'r':
            color = "#eac3ad"
            break;
        case 'g':
            color = "#c7dece"
            break;
        case 'creature':
            color = "#c7aace"
            break;
        case 'instant':
            color = "#aadece"
            break;
        case 'sorcery':
            color = "#c7deaa"
            break;
        case 'enchantment':
            color = "#caaece"
            break;
        case 'artifact':
            color = "#c7daae"
            break;
        case 'planeswalker':
            color = "#a7deca"
            break;
        case 'land':
            color = "#c7dece"
            break;
    }

    return color
}

const getName = (symbol) => {
    let name = "Colorless"
    switch(symbol){
        case 'w':
            name = "White"
            break;
        case 'u':
            name = "Blue"
            break;
        case 'b':
            name = "Black"
            break;
        case 'r':
            name = "Red"
            break;
        case 'g':
            name = "Green"
            break;
        case 'creature':
            name = "Creature"
            break;
        case 'instant':
            name = "Instant"
            break;
        case 'sorcery':
            name = "Sorcery"
            break;
        case 'enchantment':
            name = "Enchantment"
            break;
        case 'artifact':
            name = "Artifact"
            break;
        case 'planeswalker':
            name = "Planeswalker"
            break;
        case 'land':
            name = "Land"
            break;
    }

    return name
}