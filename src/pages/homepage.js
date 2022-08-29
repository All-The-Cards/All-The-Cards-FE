import { React, Component } from 'react';
import CardObject from '../components/CardObject/CardObject.js';
import * as ServerTalk from '../functions/ServerTalk.js';

export default class Home extends Component {

  state = {
    searchResults: [],
    resultsFound: "",
    serverResponse: "",
    searchInput: ""
  }

  constructor(props){
    super(props)
  }
  
  search(query){
    //if query is empty, don't send
    if (query.trim() == "/api/search/query=") {
      return 
    }
    //clear results
    this.setState({
      searchResults: []
    })

    ServerTalk.post(query).then(response => {
      if (response.length === 0){
        this.setState({
          resultsFound: <div>No Results Found</div>
        })
      }
      else {
        this.setState({
          resultsFound: <div>{response.length} Results Found</div>,
          searchResults: response.map((item, i) => <CardObject data={item} key={i}/>)
        })
      }
      
      return response
    }).then(response => {
      console.log(response)
    })

  }

  setInput(input){
    this.setState({
      searchInput: input.target.value
    })
  }
  
  render () {
    return (
      <div>
        <input 
          placeholder="Search..." 
          value={this.state.searchInput}
          onChange={(input) => this.setInput(input)}>
        </input>
        <button onClick={() => this.search("/api/search/query=" + this.state.searchInput)}>Search</button>
        <div style={{width: '400px'}}>
          <div>
            {this.state.resultsFound}
          </div>
          {this.state.searchResults}
        </div>
      </div>
    );
  }

};