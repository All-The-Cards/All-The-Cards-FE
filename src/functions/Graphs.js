
import { BarChart, Bar, PieChart, Pie, LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

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
        card_types_percents: "m",
        //ratio of producers to costs
        mana_ratio: "n"
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
    graphResults.mana_curve = <ComposedChart
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
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
    </ComposedChart>

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
    
    let color_percents_data = []
    Object.values(stats["color_percents"]).forEach((item, index) => {
    
        color_percents_data.push({
            name: Object.keys(stats["color_percents"])[index],
            percent: item
        })
    })

    graphResults.color_percents = <PieChart 
        width={400} 
        height={400}
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
    
        mana_source_counts_data.push({
            name: Object.keys(stats["mana_source_counts"])[index],
            count: item
        })
    })
    
    graphResults.mana_source_counts = <PieChart 
        width={400} 
        height={400}
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
    
        mana_source_percents_data.push({
            name: Object.keys(stats["mana_source_percents"])[index],
            percent: item
        })
    })
    
    graphResults.mana_source_percents = <PieChart 
        width={400} 
        height={400}
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
    
        card_types_counts_data.push({
            name: Object.keys(stats["card_types_counts"])[index],
            percent: item
        })
    })
    
    graphResults.card_types_counts = <PieChart 
        width={400} 
        height={400}
    >
        <Pie
        dataKey="percent"
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
    
        card_types_percents_data.push({
            name: Object.keys(stats["card_types_percents"])[index],
            percent: item
        })
    })
    
    graphResults.card_types_percents = <PieChart 
        width={400} 
        height={400}
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
        width={400} 
        height={400}
    >
        <Pie data={mana_source_counts_data} dataKey="count" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
        <Pie data={color_counts_data} dataKey="count" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label />
        
        <Tooltip />
    </PieChart>

    return graphResults;
}