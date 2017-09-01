import React from 'react'

const NameFilter = ({filterName, title, value}) => (
    <div className='filter_item name'>
        <label>{title}</label>
        <input type='text' placeholder='Type the name' onChange={filterName} value={value} />
    </div>
)

export default NameFilter
