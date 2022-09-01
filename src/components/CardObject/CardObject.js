// This Component displays a Card List View from Card .JSON info

import { React, Component } from "react";
import './CardObject.css'
import * as server from '../../functions/ServerTalk.js';

export default class CardObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            // Find image link
            imgLink: this.getImage(),
            // Create page url
            url: server.buildRedirectUrl("/card/?id=" + this.props.data.name)
            //url: server.buildRedirectUrl("/card/" + this.props.data.set + "/" + this.props.data.name)
        }
    }

    getImage(){
        let imgLink = ""
        if (this.props.data.image_uris !== null){
            // Replace all ' with " for.. JSON reasons
            imgLink = JSON.parse(this.props.data.image_uris.replaceAll('\'', '\"' )).png
        }
        else {
            //Card back, placeholder image
            imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        }
        return imgLink
    }

    render() {
        return(
            <div 
                className="CardObjectContainer"
            >
                <a 
                    href={this.state.url}
                >
                    <img 
                        src={this.getImage()}
                        className="CardObjectImage">
                    </img>
                </a>
            </div>

        );
    }
};