import React from 'react'
import {Link} from 'react-router'

const SidebarMenu = (props) => (
  <div className='sidebar_menu'>
    <Link to='/' className={props.logo + ' header_logo' } />
    <span className='header_tagline'>{props.name}</span>
  </div>
)

export default SidebarMenu
