import React from 'react'
import moment from 'moment'
import {Link} from 'react-router'

const NodesTablesRow = (props) => {
  let balance
  if (props.info.balance) {
    balance = props.info.balance + ' Sat.'
  } else {
    balance = 'Unknown'
  }
  return (
  <div className='table_row'>
    <div className='table_row-container'>
      <div className='table_row-single flex-row'>
        <div className='row_item flex-item name'>
          <div className='item_container'>
            {props.info.name}
          </div>
        </div>
        {/* <div className='row_item flex-item recipe'>
          <div className='item_container'>{props.info.recipe}</div>
        </div> */}
        <div className='row_item flex-item amount'>
          <div className='item_container'>
            <span>{balance}</span>
          </div>
        </div>
        <div className='row_item flex-item status'>
          <div className='item_container'><span className='active'>Active</span></div>
        </div>
        <div className='row_item flex-item born'>
          <div className='item_container'>{ moment(props.info.timestamp).format('D MMM, YYYY') }</div>
        </div>
        <div className='row_item flex-item icon'>
          <div className='item_container'>
            <div className='icon_container'>
              <div className='container node_actions'>
                <span onClick={() => props.handleOpenModal(props.info.name, props.info.xpub)} className='button renew'>send token</span>
                <Link to={'/context/' + props.name + '/profile'}><span className='icon-eye'></span></Link>
                <span className='icon-trash'></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default NodesTablesRow
