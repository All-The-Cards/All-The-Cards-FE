import { React, Component } from "react";
import './CardObject.css'

export default class CardObject extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
        }
    }

    render() {
        return(
            <a  
                className="CardObjectContainer">
                <img
                    className="CardImage" 
                    src={this.state.data.image_uris.png}
                    title={this.state.data.name}
                    alt={this.state.data.name}>
                </img>
            </a>

        );
    }
};