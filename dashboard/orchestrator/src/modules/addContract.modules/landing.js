import React, {Component} from 'react'
import {Link} from 'react-router'

class Landing extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <div className='page page-newContract'>
        <div className='row fullWidth'>
            <div id="secondary_header">
              <div className="header_breadcrumb">
                <h3 className="breadcrumb_title">{this.props.name}</h3>
              </div>
              <nav className="header_menu">
                <h4 className='menu_title'>Define contract type</h4>
              </nav>
            </div>
            <section className='newContract_selection'>
              <h4 className='selection_title'>Choose the contract type</h4>
              <div className='selection_type'>
                {/* <div className='type_box recharge'>
                    <h4>recharge</h4>
                </div> */}
                <Link to={'/context/' + this.props.name + '/new/contract'}>
                  <div className='type_box contract'>
                      <span className='box_contract'></span>
                      <h4>Contract</h4>
                  </div>
                </Link>
                <Link to={'/context/' + this.props.name + '/new/guarantor'}>
                  <div className='type_box guarantor'>
                    <span className='box_guarantor'></span>
                    <h4>Guarantor</h4>
                  </div>
                </Link>
              </div>
            </section>
        </div>
      </div>
    )
  }
}

export default Landing
