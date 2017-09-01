import React from 'react'

const Toast = ({type, title, description}) => {
  return (
    <div className={'toast ' + type}>
      <div className='toast_info'>
        <h1 className='toast_title'>{title}</h1>
        <p className='toast_description'>{description}</p>
      </div>
      <div className='toast_actions'>
        <span className='icon-cross2'></span> Close
      </div>
    </div>
  )
}

export default Toast
