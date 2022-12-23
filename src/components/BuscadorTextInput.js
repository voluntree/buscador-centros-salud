import React from 'react'

class BuscadorTextInput extends React.Component {
    render () {
        return (
            <div className='BuscadorTextInput'>
                <label>{this.props.label}</label>
                <input type={"text"} placeholder={this.props.placeholder}></input>
            </div>
        )
    }
}

export default BuscadorTextInput