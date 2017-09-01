import React, {Component} from 'react'
import moment from 'moment'
import axios from 'axios'
import {config} from '../../config'

class AssetDirectoryTableRow extends Component {

  componentDidMount () {
    let _this = this
    let minutes = 3
    if (!this.props.info.path) {
      let nodeIndex = this.props.imprintedNodes.indexOf(this.props.info)
      if (this.props.info.confirmations === 0) {
        axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
        .then(function (res) {
          if (res.data.confirmations === 0) {
            setTimeout(function () {
              axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
              .then(function (res) {
                _this.props.updateConfirmations(nodeIndex, res.data.confirmations)
              })
            }, minutes * 60 * 1000)
          } else {
            _this.props.updateConfirmations(nodeIndex, res.data.confirmations)
          }
        })
      }
    }
  }

  render () {
  let orchestrated
  let status
  if (this.props.info.path) {
    status = 'Confirmed'
  } else {
    if (this.props.info.confirmations > 0) {
      status = 'Confirmed'
    } else {
      status = 'Unconfirmed'
    }
  }
  if (this.props.info) {
    if (this.props.info.path) {
      orchestrated = <span className='icon-check2'></span>
    } else {
      orchestrated = <span className='icon-cross2'></span>
    }
  }
  return (
  <div className='table_row'>
    <div className='table_row-container'>
      <div className='table_row-single flex-row'>
        <div className='row_item flex-item name'>
          <div className='item_container'>
            {this.props.info.name}
          </div>
        </div>
        <div className='row_item flex-item orchestrated'>
          <div className='item_container'>{orchestrated}</div>
        </div>
        <div className='row_item flex-item amount'>
          <div className='item_container'>{status}</div>
        </div>
        <div className='row_item flex-item born'>
          <div className='item_container'><span className='active'>{ moment(this.props.info.timestamp).format('D MMM, YYYY') }</span></div>
        </div>
        <div className='row_item flex-item icon'>
          <div className='item_container'>
            <div className='icon_container'>
              <div className='container node_actions'>
                <span className={this.props.info.path ? 'button active orchestrated ' + status : 'button active ' + status } onClick={() => this.props.handleOpenModal(this.props.info.xpub, this.props.info.name)}>Add to orchestrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
}
}

export default AssetDirectoryTableRow
