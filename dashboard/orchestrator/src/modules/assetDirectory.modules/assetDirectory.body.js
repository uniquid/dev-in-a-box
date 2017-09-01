import React from 'react'
import AssetDirectoryTable from './assetDirectory.body.table'
import Filter from '../../components/filter/filter'

const AssetDirectoryBody = (props) => {
  return (
    <div className='page page_nodes'>
      <Filter />
      <AssetDirectoryTable
        filterText={props.filterText}
        nodes={props.nodes}
        imprintedNodes={props.imprintedNodes}
        toggleNode={props.onNodeToggle}
        handleOpenModal={props.handleOpenModal}
        checkConfirmation={props.checkConfirmation}
        updateConfirmations={props.updateConfirmations}
        selectedNodes={props.selectedNodes}
        filter={props.filter}
      />
    </div>
  )
}

export default AssetDirectoryBody
