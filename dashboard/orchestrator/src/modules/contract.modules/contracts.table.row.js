import React, {Component} from 'react'
import moment from 'moment'
import axios from 'axios'
import {config} from '../../config'

class ContractsTablesRow extends Component {

  fetchConfirmations (_this) {
    let contractIndex = _this.props.contracts.indexOf(_this.props.info)
    if (_this.props.info.confirmations === 0) {
      axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
      .then (function (res) {
        if (res.data.confirmations === 0) {
          setTimeout(function () {
            axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
            .then(function (res) {
              _this.props.updateConfirmations(_this.props.contextName, contractIndex, res.data.confirmations)
            })
          }, 240000)
        } else {
          _this.props.updateConfirmations(_this.props.contextName, contractIndex, res.data.confirmations)
        }
      })
    }
  }

  componentDidMount () {
    let _this = this
    let now = moment().valueOf()
    let suffMinutes = 60
    if (this.props.info.timestamp_born - now < suffMinutes * 60 * 1000) {
      let contractIndex = this.props.contracts.indexOf(this.props.info)
      if (this.props.info.confirmations === 0) {
        axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
        .then (function (res) {
          if (res.data.confirmations === 0) {
            setTimeout(function () {
              axios.get(config.bcAPI + '/tx/' + _this.props.info.txid)
              .then(function (res) {
                _this.props.updateConfirmations(_this.props.contextName, contractIndex, res.data.confirmations)
              })
            }, 240000)
          } else {
            _this.props.updateConfirmations(_this.props.contextName, contractIndex, res.data.confirmations)
          }
        })
      }
    }
  }

  render () {
  let status
  const ninetyDays = 7776000000
  let today = moment().valueOf()
  let recipeObj = JSON.parse(this.props.info.recipe)
  let annulmentObj = JSON.parse(this.props.info.annulment)

  if (this.props.info.timestamp_born - today > 60 * 15 * 1000) {
    status = 'Confirmed'
  } else {
    if (this.props.info.confirmations === 0) {
      status = 'Unconfirmed'
    } else {
      if (this.props.info.revocated) {
        status = 'Revocated'
      } else {
        status = 'Active'
      }
    }
  }
  let recipe
  if (recipeObj.recipe.length > 0) {
    recipe = recipeObj.recipe.map(function (props, i) {
      if (props.checked === true) {
        if (props.label) {
          return (
            <div key={i} className='list_item'>
            <span>{props.label}</span>
            </div>
          )
        } else {
          return (
            <div key={i} className='list_item'>
            <span>{props.value}</span>
            </div>
          )
        }
      }
    })
  }
  return (
    <div className={this.props.info.revocated ? 'table_row deactivated' : 'table_row ' }>
      <div className={this.props.nodeInfoVisibility.filter(node => node.id === this.props.info.txid).length === 0 ? 'table_row-container' : 'table_row-container visible-info'} >
        <div className='table_row-single flex-row'>
          <div className='row_item flex-item select'>
            <div className='item_container'>
              <div className='checkbox clearfix'>
                <input type='checkbox' id={this.props.info.txid} />
                <label htmlFor={this.props.info.txid} onClick={() => {this.props.onToggleContract(this.props.info.txid)}}></label>
              </div>
            </div>
          </div>
          <div className='row_item flex-item name'>
            <div className='item_container'>
              {this.props.info.user.name}
            </div>
          </div>
          <div className='row_item flex-item relations'>
            <div className='item_container'>{recipeObj.type}</div>
          </div>
          <div className='row_item flex-item provider'>
            <div className='item_container'>{this.props.info.provider.name}</div>
          </div>
          <div className='row_item flex-item status'>
            <div className='item_container'><span className={status}>{status}</span></div>
          </div>

          <div className='row_item flex-item born'>
            <div className='item_container'>{moment(this.props.info.timestamp_born).format('D MMM, YYYY')}</div>
          </div>

          <div className='row_item flex-item expire'>
            {/* <div className='item_container'>{moment(this.props.info.timestamp_expiration).format('D MMM, YYYY')}</div> */}
            <div className='item_container'>31 Dec, 2017</div>

          </div>

          <div className={this.props.info.revocated ? 'row_item flex-item icon  ' + status : 'row_item flex-item icon ' + status }>
            <div className='item_container'>
              <div className='icon_container'>
                <div className='container node_actions'>
                  {/* <span className='button renew' onClick={()=>{this.props.toggleRenew(this.props.info.txid)}}>Renews</span> */}
                  <span className='icon-eye' onClick={() => this.props.handleInfoVisibility(this.props.info.txid)}></span>
                  <span className='icon-trash' onClick={()=>{this.props.deleteContract(this.props.info)}} ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='table_row-info'>
          <div className='graph'>
            <div className='row collapse'>
              <div className='medium-4 columns'>
                <div className='graph_node graph_user'>
                  <span>{this.props.info.user.name}</span>
                </div>
              </div>
              <div className='medium-4 columns'>
                <div className='graph_node graph_annulment'>
                  <div className='annulment_list'>
                    <div className='list_item'>
                      <span>{annulmentObj.name}</span>
                    </div>
                  </div>
                </div>
                <div className='graph_node graph_commitment'>
                  <div className='commitment_list wo_representatives'>
                  </div>
                </div>
              </div>
              <div className='medium-4 columns'>
                <div className='graph_node graph_machine'>
                  <span>{this.props.info.provider.name}</span>
                  <div className='machine_list'>
                    {recipe}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
}

export default ContractsTablesRow
