// @flow
import React from 'react'
import {Link} from 'react-router'

const SingleContext = ({id, name}) => (
  <li className='list_item' key={id}>
    <Link className='item_link' activeClassName='active' to={'o/context/' + name}>{name}</Link>
    <span className='icon-trash' />
  </li>
)

export default SingleContext
