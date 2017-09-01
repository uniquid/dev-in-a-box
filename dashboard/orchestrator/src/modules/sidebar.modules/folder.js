// @flow
import React from 'react'
import ContextsSearch from './contextsSearch'
import SingleContext from './singleContext'
import {Link} from 'react-router'

const Folder = (props) => {
  let rows = []
  props.contexts.map(function (context) {
    if (context.name.indexOf(props.filterText) !== -1) {
      return rows.push(<SingleContext key={context.xpub} name={context.name} />)
    }
  })

  return (
    <div>
      <h3 className='contexts_title'>
        <span className={props.icon} />
        {props.title}
      </h3>
      <ContextsSearch {...props} />
      <ul className='contexts_list'>
        <li className='list_item'>
          <Link className='item_link' activeClassName='active' to={'/o/context/asset'}>Asset Directory</Link>
        </li>
        {rows}
      </ul>
    </div>
  )
}

export default Folder
