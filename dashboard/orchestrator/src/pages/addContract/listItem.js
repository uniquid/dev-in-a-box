import React from 'react'
import PropTypes from 'prop-types'

const ListItem = ({machine, filterText, selectNode, type, input, checked}) => (
  
  <div key={type + machine.id} className={machine.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1 ? 'list_item ' + type + ' clearfix deactivate' : 'list_item ' + type + ' ' + input + ' clearfix'}>    
    
    {checked === 'null' ? (
      <input onClick={selectNode} className={input + ' item_checkbox'} id={type + '-' + machine.id} value={machine.id} name={type} type={type === 'user' ? 'checkbox' : 'radio'} />
    ) : (
      <input checked={checked} onClick={selectNode} className={input + ' item_checkbox'} id={type + '-' + machine.id} value={machine.id} name={type} type={type === 'user' ? 'checkbox' : 'radio'} />
    )}
    <label htmlFor={type + '-' + machine.id}>{machine.name}</label>
  </div>
)

ListItem.propTypes = {
  machine: PropTypes.object,
  filterText: PropTypes.string,
  selectNode: PropTypes.func,
  type: PropTypes.string
}

export default ListItem
