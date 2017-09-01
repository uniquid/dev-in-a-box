import React from 'react'
import ContractsTablesRow from './contracts.table.row'

const ContractsTables = (props) => {
  let rows = []
  if (props.contracts !== undefined) {
    props.contracts.map(function (contract, i) {
      var checked
      if (contract.provider.name.indexOf(props.filter.name) !== -1) {
        return rows.push(<ContractsTablesRow
          cancelRenew={props.cancelRenew}
          updateContract={props.updateContract}
          activeEndDateLink={props.activeEndDateLink}
          expirationDate={props.timestamp_expiration}
          addEndDate={props.addEndDate}
          handleEndDate={props.handleEndDate}
          toggleRenew={props.toggleRenew}
          renewVisibility={props.renewVisibility}
          toggledIds={props.toggledIds}
          onToggleContract={props.onToggleContract}
          deleteContract={props.deleteContract}
          key={contract.txid}
          info={contract}
          nodeInfoVisibility={props.nodeInfoVisibility}
          handleInfoVisibility={props.handleInfoVisibility}
          filterStatus={props.filterStatus}
          updateConfirmations={props.updateConfirmations}
          contracts={props.contracts}
          contextName={props.contextName}
        />)
      } else {
        console.log('no')
      }
    })
  }

  return (
    <div className='contracts table row collapse'>
    <div className='flex_table'>
      <div className='table_row'>
        <div className='table_row-head flex-row'>
          <div className='row_item flex-item name'>
            <div className='item_container'>User</div>
          </div>
          <div className='row_item flex-item relations'>
            <div className='item_container'>Recipe</div>
          </div>
          <div className='row_item flex-item provider'>
            <div className='item_container'>Provider</div>
          </div>
          <div className='row_item flex-item status'>
            <div className='item_container'>Status</div>
          </div>
          <div className='row_item flex-item expire'>
            <div className='item_container'>Deployed</div>
          </div>
          <div className='row_item flex-item expire'>
            <div className='item_container'>Expirationr</div>
          </div>
          <div className='row_item flex-item icon' />
        </div>
      </div>
        {rows}
    </div>
  </div>
  )
}

export default ContractsTables
