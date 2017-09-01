import React from 'react'

const SelectFilter = ({title, filterStatus, options, value }) => (
    <div className='filter_item status'>
        <label>{title}</label>
        <select value={value} onChange={filterStatus}>
            <option key={null} value=''>ALL</option>
            {options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
            ))}
        </select>
    </div>
)

export default SelectFilter
