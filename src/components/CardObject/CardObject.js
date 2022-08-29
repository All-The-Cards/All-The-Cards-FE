// This Component displays a Card Image from Card .JSON info

import { React, Component } from "react";
import './CardObject.css'
import * as ServerTalk from '../../functions/ServerTalk.js';

export default class CardObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            // Find image link
            imgLink: this.getImage(),
            // Create page url
            url: ServerTalk.buildRedirectUrl("/cards/" + this.props.data.set + "/" + this.props.data.name)
        }
    }

    getImage(){
        let imgLink = ""
        if (this.props.data.image_uris !== null){
            // Replace all ' with " for.. JSON reasons
            imgLink = JSON.parse(this.props.data.image_uris.replaceAll('\'', '\"' )).normal
        }
        else {
            //Card back, placeholder image
            imgLink = "https://static.wikia.nocookie.net/mtgsalvation_gamepedia/images/f/f8/Magic_card_back.jpg"
        }
        return imgLink
    }

    render() {
        return(
            <a  
                href={this.state.url}
                className="CardObjectContainer">
                <img
                    className="CardImage" 
                    src={this.state.imgLink}
                    title={this.state.data.name}
                    alt={this.state.data.name}>
                </img>
            </a>

        );
    }
};