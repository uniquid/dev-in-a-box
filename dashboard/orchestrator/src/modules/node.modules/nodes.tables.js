import React from 'react'
import NodesTablesRow from './nodes.tables.row'

const NodesTables = (props) => {
  let rows = []
  if (props.nodes !== undefined) {
    props.nodes.map(function (node, index) {
      let checked
      if (props.selectedNodes.filter(sel => sel === node.xpub)[0]) { checked = true }
      if (node.name.indexOf(props.filter.name) !== -1) {
        return rows.push(<NodesTablesRow
          name={props.name}
          index={index}
          handleOpenModal={props.handleOpenModal}
          key={node.xpub}
          info={node}
          toggleNode={props.toggleNode}
          deleteNode={props.deleteNode}
        />)
      }
    })
  }
  return (
  <div className='nodes table row collapse' >
    <div className='flex_table'>
      <div className='table_row'>
        <div className='table_row-head flex-row'>        
          <div className='row_item flex-item name'>
            <div className='item_container'>Name</div>
          </div>
          <div className='row_item flex-item amounts'>
            <div className='item_container'>Amounts</div>
          </div>
          <div className='row_item flex-item status'>
            <div className='item_container'>Status</div>
          </div>
          <div className='row_item flex-item born'>
            <div className='item_container'>Born</div>
          </div>
          <div className='row_item flex-item icon' />
        </div>
      </div>
      {rows}
    </div>
    </div>
  )
}

export default NodesTables
