import React, {Component} from 'react'
import {BrowserHistory, Link} from 'react-router'
import PropTypes from 'prop-types'
import {logout} from '../../services/user'
import tabacchi from '../../services/tabacchi'
import imprinter from '../../services/imprinter'
import {tabacchi as tabacchi_config, config} from '../../config'

class Header extends Component {
  constructor () {
    super()
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.toggleSide = this.toggleSide.bind(this)
    this.mine = this.mine.bind(this)
    this.switchOrchestratorIp = this.switchOrchestratorIp.bind(this)
    this.state = {
      action: false,
      sideMenu: false,
      orchestratorIp: !!config.useOrchestratorServer
    }
  }

  toggleDropdown (e) {
    this.setState({
      action: !this.state.action
    })
  }

  logout () {
    [
      'ip',
      'name',
      'session'
    ].forEach(name => sessionStorage.removeItem(name))
    window.location.reload()
  }

  recharge() {
    return imprinter.get('nodeinfo')
      .then(resp => resp.data.topupAddress)
      .then(topupAddress => tabacchi.post('topup',{
        address: topupAddress,
        amount: tabacchi_config.rechargeAmount
      }))
      .then(()=>tabacchi.get('mineshot'))
      .then(res => alert('Massive imprinter refilled correctly!'))
      .catch(err=> alert(`Error during the recharge action:\n${err.message}`))
  }

  toggleSide (e) {
    this.setState({
      sideMenu: !this.state.sideMenu
    })
  }

  mine () {
    tabacchi.get('mineshot')
      .then(res => alert('Mine correctly performed'))
      .catch(()=> alert('Error durint the mine request'))
  }

  switchOrchestratorIp () {
    this.setState({
      orchestratorIp: !this.state.orchestratorIp
    }, () => (
      config.useOrchestratorServer = this.state.orchestratorIp
    ))
  }

  render () {
    let name = sessionStorage.getItem('name')
    return (
      <div>
        <header id='main_header'>
          <div className='header_title'>
            <h3><span onClick={() => this.toggleSide()} className={this.state.sideMenu ? 'icon-menu active' : 'icon-menu'} /><Link to='/'>uniquid</Link></h3>
              <label className='switch' title={config.orchestratorApiUrl ? `switch to ${this.state.orchestratorIp ? "Smartphone" : "Server"}` : 'No server in config\nonly Smartphone enabled'}>
                <input checked={this.state.orchestratorIp} type='checkbox' disabled={!config.orchestratorApiUrl} onChange={() => this.switchOrchestratorIp()}  />
                <span className='slider' />
              </label>
            <i>{this.state.orchestratorIp ? 'Connected to Server' : 'Connected to Smartphone'}</i>
          </div>
            <div className='header_right'>
              <button className='right_recharge' onClick={this.recharge}>Recharge Imprinter</button>
              <button className='right_mine' onClick={() => this.mine()} >Mine</button>
              <div className='right_notification'>
              <span className='icon-bell2' />
              {/* <span className='icon-plus' onClick={() => this.toggleDropdown('action')} />
              <div className={this.state.action ? 'notification_dropdown active' : 'notification_dropdown'}>
                <ul className='dropdown_list'>
                   <li className='list_item'><Link to='/new-context'>Add Context</Link></li>
                </ul>
              </div> */}
            </div>
            <div className='header_profile'>
              <h4 className='profile_name'>{name}</h4>
              <div className='profile_picture'>
                <div className='picture_photo' />
                <div className='profile_socket'>
                  <div className={this.props.connectionStatus + ' socket_status'} />
                </div>
                <span title='logout' onClick={() => this.logout()} className='active icon-cross'/>
            </div>
            <span className={this.props.connectionStatus === 'Disconnected' ? 'disactive icon-dots-three-vertical' : 'icon-dots-three-vertical'} />
          </div>
          </div>
        </header>
        <div className={this.state.sideMenu ? 'header_side active' : 'header_side' }>
          <h5 className='side_title'>Choose an app</h5>
          <ul className='side_list'>
             <li className='list_item'><Link to='/i'>Imprinter</Link></li>
             <li className='list_item'><Link to='/o'>Orchestrator</Link></li>
          </ul>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  size: PropTypes.string,
  back: PropTypes.string,
  name: PropTypes.string,
  action: PropTypes.bool,
  connectionStatus: PropTypes.string,
  active: PropTypes.string
}

Header.defaultProps = {
  size: '',
  back: 'inactive',
  name: '',
  action: false,
  connectionStatus: '',
  active: 'inactive'
}

export default Header
