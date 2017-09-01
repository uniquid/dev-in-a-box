import React from 'react'
import moment from 'moment'

const DashboardOperation = (props) => {
  let row = []
  if (props.txs.length > 0) {
    props.txs[0].txs.map(function (tx, i) {
      let date = moment.unix(tx.time).format('D MMM, YYYY')
      return row.push(
        <div key={i} className='table_row'>
          <div className='table_row-container'>
            <div className='table_row-single flex-row'>
              <div className='row_item flex-item operation_date'>
                <div className='item_container'>
                  {date}
                </div>
              </div>
              <div className='row_item flex-item operation_from'>
                <div className='item_container'>from</div>
              </div>
              <div className='row_item flex-item operation_address'>
                <div className='item_container'>{tx.vin[0].addr}</div>
              </div>
              <div className='row_item flex-item operation_status'>
                <div className='item_container'>{tx.confirmations}</div>
              </div>
              <div className='row_item flex-item operation_fiat'>
                <div className='item_container'>{tx.fees}</div>
              </div>
              <div className='row_item flex-item operation_btc'>
                <div className='item_container'> {tx.valueIn} mBTC</div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }
  return (
    <section className='dashboard_operations'>
      <div className='flex_table'>
        <div className='table_row'>
          <div className='table_row-head flex-row'>
            <div className='row_item flex-item operation_date'>
              <div className='item_container'>Date</div>
            </div>
            <div className='row_item flex-item operation_from'>
              <div className='item_container'>From/To</div>
            </div>
            <div className='row_item flex-item operation_address'>
              <div className='item_container'>Address</div>
            </div>
            <div className='row_item flex-item operation_status'>
              <div className='item_container'>Confirmations</div>
            </div>
            <div className='row_item flex-item operation_fiat'>
              <div className='item_container'>Fees</div>
            </div>

            <div className='row_item flex-item operation_btc'>
              <div className='item_container'>Amount</div>
            </div>
          </div>
        </div>
        {row}
      </div>
    </section>
  )
}

export default DashboardOperation
