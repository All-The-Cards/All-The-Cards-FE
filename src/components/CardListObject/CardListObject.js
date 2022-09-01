// This Component displays a Card Image from Card .JSON info

import { React, Component } from "react";
import './CardListObject.css'
import * as server from '../../functions/ServerTalk.js';

export default class CardListObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            // Create page url
            url: server.buildRedirectUrl("/card/?id=" + this.props.data.name)
            //url: server.buildRedirectUrl("/card/" + this.props.data.set + "/" + this.props.data.name)
        }
    }

    render() {
        return(
            <div style={{width: '250px'}}>
                <a  
                    className="CardListObjectContainer"
                    href={this.state.url}
                >
                    <div className="CardListContent-Left">
                        {this.state.data.name}
                    </div>
                    <div className="CardListContent-Right">
                        {this.state.data.color_identity}
                    </div>
                </a>
            </div>

        );
    }
};