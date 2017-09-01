import React from 'react'
import ProgressBar from 'react-progress-bar-plus'

const Loader = (props) => {
  return (
  <section className={ props.status ? 'loader_blockchain' : 'loader_blockchain active' }>
    <ProgressBar percent={Number(props.percent)} spinner={false}/>
    <div className='blockchain_bar'>
      <h4><span className='bar_wait'></span>{props.message}</h4>
      <div className='bar_actions'>
        {/* <button className='actions_retry'>Retry</button> */}
      </div>
    </div>
  </section>
)
}

export default Loader
