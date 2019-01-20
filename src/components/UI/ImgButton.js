import React, { Component } from 'react';
class ImgButton extends Component {


    constructor(props) {
        super(props);

        this.click = () => {
            alert("Clicked " + this.props.id);
        };

    }

    render(){
        return <button id={this.props.id} onClick={(e) => this.click()} {...this.props}>
                    <img className={"ui-img"} alt="NOT LOADED" src={this.props.src}/>
                </button>;
    }
}
export default ImgButton;