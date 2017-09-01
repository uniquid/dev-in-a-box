import React from 'react'

const ContextsSearch = ({toggle, visible, handleUserInput, filterText}) => {
  return (
    <div>
      <div className='contexts_actions'>
        <span className='icon-magnifying-glass' onClick={toggle} />
      </div>
      <div id='contexts_search' className={visible ? 'active' : ''}>
        <input onChange={handleUserInput} className='search_input' type='text' placeholder='Search in contexts' value={filterText} />
      </div>
    </div>
  )
}


export default ContextsSearch
