import React from 'react'

class BuscadorComboBox extends React.Component {
    render () {
        return (
            <div className='BuscadorTextInput'>
                <label>{this.props.label}</label>
                <div>
                <select className='combobox'>
                    <option value="todos">Todos</option>
                    <option value="hospital">Hospital</option>
                    <option value="centro de salud">Centro de Salud</option>
                    <option value="otros">Otros</option>
                </select>
                </div>
            </div>
        )
    }
}

export default BuscadorComboBox