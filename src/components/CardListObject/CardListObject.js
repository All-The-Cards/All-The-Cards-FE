// This Component displays a Card Image from Card .JSON info

import { React, Component, useEffect } from "react";
import './CardListObject.css'
import * as server from '../../functions/ServerTalk.js';

export default class CardListObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            // Create page url
            url: server.buildRedirectUrl("/card/?id=" + this.props.data.id)
            //url: server.buildRedirectUrl("/card/" + this.props.data.set + "/" + this.props.data.name)
        }
    }

    render() {
        return(
            <div 
                className="CardListObjectContainer"
            >
                <a 
                    href={this.state.url}
                >
                    <div className="CardListInfo">
                        <div className="CardListContent">
                            {this.state.data.name} 
                        </div>
                        <div className="CardListContent">
                            {/* {this.state.data.set_shorthand.toUpperCase()} */}
                        </div>
                    </div>
                </a>
            </div>

        );
    }
};