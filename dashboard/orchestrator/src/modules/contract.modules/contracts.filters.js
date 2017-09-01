import React from 'react'
import {Link} from 'react-router'
const ContractsFilters = (props) => {
  return (
      <div className="filters">
        <div className="filters_title">
          <span className="icon-magnifying-glass" onClick={props.toggle}></span>
          <div id="filters_search" className={props.visible ? "active filters_search" : "filters_search"}>
            <form className="search">
              <input onChange={props.handleChange} type="text" placeholder="Search in contexts" value={props.filterText}/>
            </form>
          </div>
        </div>
        <div className='filter_contractType'>
          <select value={props.filterStatus} onChange={props.handleContractFilter}>
            <option value='all'>All Contract</option>
            <option value='active'>Active</option>
          </select>
        </div>
        {/* <div className='filter_buttons'>
          <button className="delete_contracts" onClick={()=>{props.onMultipleNodesDelected(props.toggledIds)}}><span className="contracts_number">{props.toggledIds.length}</span>Delete contracts</button>
          <Link className="add_contract" to={'/context/'+props.contextName+'/new-contract'}>Add contract</Link>
        </div> */}
      </div>
  )
}

export default ContractsFilters
