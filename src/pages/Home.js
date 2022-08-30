import { React, useState } from 'react';
import * as server from '../functions/ServerTalk.js';

const Home = (props) => {

  const [state, setState] = useState({
    
  })

  return (
    <div>
      <a href={server.buildRedirectUrl("/search/")}>
        <button>Go to Searchpage</button>
      </a>
      
    </div>
  );

};

export default Home;