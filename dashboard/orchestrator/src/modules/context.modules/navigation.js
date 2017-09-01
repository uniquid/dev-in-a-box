import React from 'react'

const Navigation = ({}) => (
  <section className='dashboard_menu'>
    <IndexLink activeClassName='active' to={'/o/context/'+this.props.name}>
      <span className='icon-list' />
      {this.props.nodes} Nodes
    </IndexLink>
    <Link activeClassName='active' to={'/o/context/'+this.props.name+'/contracts'}>
      <span className='icon-archive' />
      {this.props.contracts} Contracts
    </Link>      
    <div className='menu_actions'>
      <button className='actions_contract'>
        <Link activeClassName='active' to={'/o/context/' + this.props.name + '/new-contract'}>Create a contract</Link>
      </button>
    </div>
  </section>
)

export default Navigation
