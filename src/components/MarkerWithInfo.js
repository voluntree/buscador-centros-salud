import React, {Component} from 'react';
import { Marker, InfoWindow } from "@react-google-maps/api";


class MarkerWithInfo extends Component {

    constructor(props){
        super(props);

        this.state = {
            isOpen: false
        }

    }

    handleToggleOpen = () => {

        this.setState({
            isOpen: !this.isOpen
        });
    }

    handleToggleClose = () => {
        this.setState({
            isOpen: false
        });
    }


  render() {

    return (
            <Marker
                key={this.props.index}
                position={{ lat: this.props.lat, lng: this.props.lng}}
                label={this.props.index.toString()}
                onClick={() => this.handleToggleOpen()}
            >

            {
                this.state.isOpen &&
             <InfoWindow onCloseClick={this.props.handleCloseCall}>
                 <span>Something</span>
             </InfoWindow>
            }


            </Marker>

        )
  }
}

export default MarkerWithInfo;