import React from 'react'

const ErrManager = (props) => {
  return (
    <div className={props.status ? 'window_errManager active' : 'window_errManager'} >
      <div className='errManager_box'>
        <div className='box_image'>
          <span className={props.icon}></span>
        </div>
        <h4 className='box_section'>{props.title}</h4>
        <p className='box_description'>{props.message}</p>
        <div className='box_actions'>
          <button className='retry' onClick={() => {props.retry()}}>
            <span className='icon-ccw'></span>
            retry
          </button>
           <button className='cancel' onClick={()=>{props.close()}}>
            close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrManager
