import React from 'react'

const Head = ({selectedUser, selectedProvider, sendContract}) => {
  const can_t_send = !(selectedUser.length && selectedProvider.length)
  return <div className='row'>
    <div className='medium-8 medium-offset-2 columns'>
      <h2 className='newContract_title'>Create a new contract</h2>
      <div className='newContract_explanation'>
        <div className='explanaton_user'>
          <span className='user_tot'>{selectedUser.length}</span>
          <h5>User</h5>
        </div>
        <div className='explanaton_link' />
        <div className='explanaton_provider'>
          <span className='user_tot'>{selectedProvider.length}</span>
          <h5>Provider</h5>
        </div>
      </div>
      <button disabled={can_t_send} onClick={sendContract} className={`send_contract ${can_t_send ? '' : 'active'}`}>Send Contract</button>

    </div>
  </div>
}

export default Head
