// @flow

import React from 'react'
import {Link, IndexLink} from 'react-router'

const HeaderContext = ({name, menu, totalNodes, baseRoute, actions, active, path}) => (
    <div className='header_overview'>
      <div className='primary_info'>
        <div className='info_image' />
        <h3 className='info_name'>{name}</h3>
      </div>
      <section className='dashboard_menu'>
        <button>
          <IndexLink activeClassName='active' to={baseRoute}>
            <span className='icon-list' />
            {totalNodes} Nodes
          </IndexLink>
        </button>
        {menu ? menu.map((item, i) => (
          <button key={i}>
          <Link activeClassName='active' to={'/o/context/' + name + '/' + item.name}>
            <span className={item.icon} />
            {item.total + ' ' + item.name}
          </Link>
          </button>
        )) : ''}
        {actions ? (
          <div className='menu_actions'>
              <Link className='actions_contract' activeClassName='active' to={'/o/context/' + name + '/new-contract'}> Create a contract</Link>
          </div>
        ) : ''}
      </section>
    </div>
  )

export default HeaderContext
