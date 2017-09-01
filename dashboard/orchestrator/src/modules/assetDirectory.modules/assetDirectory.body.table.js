import React from 'react'
import AssetDirectoryTableRow from './assetDirectory.body.table.row'
import uuid from 'uuid'

const AssetDirectoryTable = (props) => {
  let rows = []
  if (rows.length === 0) {
    if (props.nodes !== undefined) {
      let allNodes = props.nodes.concat(props.imprintedNodes)
      allNodes.reverse()
      allNodes.map(function (node) {
        let checked
        if (props.selectedNodes.filter(sel => sel === node.xpub)[0]) {checked = true}
        if (node.name.indexOf(props.filter.name) !== -1) {
          return rows.push(
            <AssetDirectoryTableRow
              handleOpenModal={props.handleOpenModal}
              addOrchestrator={props.addOrchestrator}
              key={uuid.v1()}
              info={node}
              toggleNode={props.toggleNode}
              checkConfirmation={props.checkConfirmation}
              updateConfirmations={props.updateConfirmations}
              imprintedNodes={props.imprintedNodes}
            />)
        }
      })
    }
  }
  return (
    <div className='nodes table row collapse'>
    <div className='flex_table'>
      <div className='table_row'>
        <div className='table_row-head flex-row'>
          <div className='row_item flex-item name'>
            <div className='item_container'>Name</div>
          </div>
          <div className='row_item flex-item orchestrated'>
            <div className='item_container'>Orchestrated</div>
          </div>
          <div className='row_item flex-item amounts'>
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

export default AssetDirectoryTable
