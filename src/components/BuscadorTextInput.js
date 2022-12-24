import React from 'react'

class BuscadorTextInput extends React.Component {
    render () {
        return (
            <div className='BuscadorTextInput'>
                <label>{this.props.label}</label>
                <input type={"text"} placeholder={this.props.placeholder} value= {this.props.value} onChange={value => this.props.onChange(value.target.value)}></input>
            </div>
        )
    }
}

export default BuscadorTextInput