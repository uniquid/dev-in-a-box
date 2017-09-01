// @flow
import React from 'react'

const NodesFilters = (props) => {
  return (
    <div className='filters'>
      <div className='filters_title'>
        <span className='icon-magnifying-glass' onClick={props.toggle}></span>
        <div id='filters_search' className={props.visible ? 'active filters_search' : 'filters_search'}>
          <form className='search'>
            <input onChange={props.handleChange} type='text' placeholder='Search in contexts' value={props.filterText}/>
          </form>
        </div>
      </div>
      {/* <button className='delete_nodes' onClick={() => {props.deleteNodes(props.toggledNodes)}}><span className='nodes_number'>{props.toggledNodes.length}</span>Delete nodes</button>
      <button className='add_nodes'>Add nodes</button> */}
    </div>
  )
}
export default NodesFilters
