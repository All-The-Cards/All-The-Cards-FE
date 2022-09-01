// This Component displays a Deck Preview from Deck .JSON info

import { React, Component } from "react";
import './DeckTileObject.css'
import * as server from '../../functions/ServerTalk.js';

export default class DeckTileObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            // Find image link
            imgLink: this.getImage(),
            // Create page url
            url: server.buildRedirectUrl("/deck/?id=" + this.props.data.id)
            //url: server.buildRedirectUrl("/deck/" + this.props.data.set + "/" + this.props.data.name)
        }
    }

    getImage(){
        let imgLink = ""
        if (this.props.data.cover_art !== null){
            // Replace all ' with " for.. JSON reasons
            imgLink = this.props.data.cover_art
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
                className="DeckTileObjectContainer"
                style={{backgroundImage: 'radial-gradient( rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3) ), url(' + this.getImage() + ')'}}
            >
                <a 
                    href={this.state.url}
                >
                    <div className="DeckClickable">
                        <div className="DeckInfo">
                            <div className="DeckTitle">{this.state.data.title}</div>
                            <div className="DeckAuthor">{this.state.data.author}</div>
                        </div>
                    </div>
                </a>
            </div>

        );
    }
};