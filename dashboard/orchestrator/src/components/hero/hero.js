import React, {Component} from 'react'
import {Link, IndexLink} from 'react-router'
import FileInput from 'react-file-input'
import axios from 'axios'
import {config} from '../../config'

class Hero extends Component {
  constructor () {
    super()
    this.fileUpload = this.fileUpload.bind(this)
    this.updateProperties = this.updateProperties.bind(this)
    this.resetProperties = this.resetProperties.bind(this)

    this.state = {
      properties: null
    }
  }
  sendProperties (e) {
    let _this = this
    axios.post('uploadsettings', {
      data: _this.state.properties
    })
    .then(res => _this.props.updateStatus(res))
    .catch(err => _this.props.updateStatus(err))
  }


  fileUpload () {
    let _this = this
    const url = config.imprinterApiUrl + 'uploadsettings'
    const formData = new FormData()
    formData.append('file', _this.state.properties)
    const Config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    return axios.post(url, formData, Config)
    .then(res => console.log((res)))
    .catch(() => _this.props.hasError('500', 'icon-cross2', 'Properties not valid', 'Properties not valid',() => this.fileUpload()))
  }

  updateProperties (e) {
    this.setState({
      properties: e.target.files[0]
    })
  }

  resetProperties () {
    this.setState({
      properties: null
    })
  }

  render () {
    return (
      <section className='header imprinter row'>
          <div className='header_data'>
            <div className='data_header'>
              <h4 className='header_title'>MassiveImprinter0100001</h4>
              <div className='header_actions'>
                <FileInput name='Props'
                  accept='.png,.gif'
                  placeholder='Load Properties'
                  className='actions_load'
                  onChange={this.updateProperties}
                />
                <button onClick={() => this.fileUpload()} className={this.state.properties ? 'actions_send active' : 'actions_send'}>Load</button>
              </div>
            </div>
            <h3>Overview</h3>
            <div className='row'>
              <div className='medium-3 columns'>
              <div className='data_unit'>
                <h2 className='unit_value'>{(this.props.imprinter.balance || 0) / 100000}</h2>
                <h4 className='unit_title'>Balance</h4>
              </div>
              </div>
              <div className='medium-3 columns'>
              <div className='data_unit'>
                <h2 className='unit_value'>{this.props.imprinter.totalNodes || 0}</h2>
                <h4 className='unit_title'>Total Nodes</h4>
              </div>
              </div>
              <div className='medium-3 columns'>
              <div className='data_unit'>
                <h2 className='unit_value'>{this.props.imprinter.totalImprinted || 0}</h2>
                <h4 className='unit_title'>Imprinted</h4>
              </div>
              </div>
              <div className='medium-3 columns'>
              <div className='data_unit'>
                <h2 className='unit_value'>{this.props.imprinter.totalOrchestrated || 0}</h2>
                <h4 className='unit_title'>Orchestrated</h4>
              </div>
              </div>
            </div>
          </div>
          <div className='header_menu'>
            <ul className='menu_list'>
              <li className='list_item'>
                <IndexLink activeClassName='active' to={'/i'}>Machines</IndexLink>
              </li>
              <li className='list_item'>
                <Link activeClassName='active' to={'/i/orchestrators'}>Orchestrators</Link>
              </li>
            </ul>
          </div>
      </section>
    )
  }
}

export default Hero
