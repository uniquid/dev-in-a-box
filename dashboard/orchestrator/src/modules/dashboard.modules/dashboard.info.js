import React from 'react'
import {Link} from 'react-router'

const DashboardInfo = (props) => {
  let balance
  if (props.txs.length > 0) {
    balance = Number(props.txs[0].balance) * 10
  } else {
    balance = 0
  }
  return (
    <section className='dashboard_info'>
      <div className='info'>
        <div className='info_balance'>
          <h2 className='balance_title'>
            Balance
          </h2>
          <h4 className='balance_btc'>{balance}<span>mBTC</span></h4>
        </div>
        <div className='info_actions'>
          <button onClick={() => props.handleOpenAddress()} className='actions_deposit'>Deposit Bitcoins</button>
          <Link to={'/context/' + props.name + '/new-contract'}><button className='actions_contract'><span className='contract_icon'></span>Add Contract</button></Link>
          <button className='actions_xpub' onClick={() => props.handleOpenModal()}><span className='xpub_icon'></span>Show xPub</button>
        </div>
      </div>
    </section>
  )
}

export default DashboardInfo
