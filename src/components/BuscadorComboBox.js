import React from 'react'

const BuscadorComboBox = (props) => {
    
        return (
            <div className='BuscadorTextInput'>
                <label>{props.label}</label>
                <div>
                <select className='combobox' onChange={value => props.onChange(value.target.value)}>
                    <option value="todos">Todos</option>
                    <option value="hospital">Hospital</option>
                    <option value="centro de salud">Centro de Salud</option>
                    <option value="otros">Otros</option>
                </select>
                </div>
            </div>
        )
    
}

export default BuscadorComboBox