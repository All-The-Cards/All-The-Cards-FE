
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function makeGraphs(stats) {

    console.log("All stats:", Object.keys(stats))
    
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

    let mana_curve_data = stats["mana_curve"].map((item, index) => {
        let num = index
        if (num > 7) num = "8+"
        return {
            cost: num,
            count: item
        }
    })
    graphResults.mana_curve = <BarChart
        width={500}
        height={300}
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
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
    </BarChart>

    //color_counts
    
    let color_counts_data = []
    
    Object.values(stats["color_counts"]).forEach((item, index) => {
        color_counts_data.push({
            name: Object.keys(stats["color_counts"])[index],
            count: item
        })
    })

    graphResults.color_counts = <PieChart 
        width={400} 
        height={400}
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

    //mana_source_counts

    //mana_source_percents

    //total_prices

    //card_types_counts

    //card_types_percents



    return graphResults;
}