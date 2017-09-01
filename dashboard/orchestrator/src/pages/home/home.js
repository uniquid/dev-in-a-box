import React, {Component} from 'react'
import Header from '../../components/header/header'
import {Link} from 'react-router'

class Home extends Component {
  render () {
    let name = sessionStorage.getItem('name')
    return (
      <div>
          <div className='console_background' />
          {/* <Loader status={this.props.synced.status} percent={this.props.synced.percent} message={this.props.synced.message}/>  */}
          <Header
            user={this.props.user}
            reconnect={this.props.reconnect}
            connectionStatus={this.props.status}
            name={'Home'}
        />
          <section className='console'>
          <div className='row'>
            <div className='medium-12 columns'>
              <h3 className='console_title'>Welcome {name}</h3>
              <h5 className='console_tagline'>Choose an application to work with</h5>
              <div className='console_app row'>
                <div className='medium-4 end columns'>
                  <Link to='/i'>
                    <div className='app_item'>
                      <span className='icon-folder' />
                      <h5 className='item_title'>Imprinter</h5>
                    </div>
                  </Link>
                </div>
                <div className='medium-4 end columns'>
                  <Link to='/o'>
                    <div className='app_item'>
                      <span className='icon-folder' />
                      <h5 className='item_title'>Orchestrator</h5>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            {
            // <div className='medium-6 columns'>
            //   <div className='console_explanation'>
            //     <h4 className='explanation_title'>Imprinter</h4>
            //     <div className='explanation_description'>
            //       There are many things that are important to catalog design. Your images must be sharp and appealing. Your text and even the font you use for the text is important. The cover page design and the design of your catalog’s product pages all play important roles in designing a catalog that will bring in new customers and sales.
            //     </div>
            //     <h3 className='explanation_features'>Features</h3>
            //     <ul className='explanation_list'>
            //       <li className='list_item'>Lorem impsum 1</li>
            //       <li className='list_item'>Lorem impsum 1</li>
            //       <li className='list_item'>Lorem impsum 1</li>
            //       <li className='list_item'>Lorem impsum 1</li>
            //     </ul>
            //     <button className='explanation_open'>Open</button>
            //   </div>
            // </div>
            }
          </div>
        </section>
      </div>
    )
  }
}

export default Home
