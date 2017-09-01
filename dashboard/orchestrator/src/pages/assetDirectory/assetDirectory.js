import React, { Component } from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Loader from '../../components/loader/loader'
import Feedback from '../../components/feedback/feedback'
import AssetDirectoryBody from '../../modules/assetDirectory.modules/assetDirectory.body'
import {connect} from 'react-redux'
import uidMethods from '../../uidMethods'
import ReactModal from 'react-modal'
import Select from 'react-select'
import async from 'async'
import Orchestrator from '../../components/bitcoinManager/orchestrator'
import moment from 'moment'
import axios from 'axios'
import {updateConfirmationsAction} from '../../core/actions/nodes'
import {config} from '../../config'
import Header from '../../components/header/header'
import {browserHistory} from 'react-router'
import HeaderContext from '../../modules/context.modules/menuContext'

class AssetDirectory extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.selectOrchestrator = this.selectOrchestrator.bind(this)
    this.addOrchestrator = this.addOrchestrator.bind(this)
    this.closeError = this.closeError.bind(this)
    this.checkConfirmation = this.checkConfirmation.bind(this)
    this.state = {
      filterNodes: '',
      showModal: false,
      value: '',
      label: '',
      nodeXpub: '',
      nodeName: ''
    }
  }

  checkConfirmation (txid, callback) {
    let _this = this
    axios.get(config.bcAPI + '/tx/' + txid)
    .then(function (res) {
      if (res.data.confirmations === 0) {
        _this.forceUpdate()
      }
      callback(null, res.data.confirmations)
    })
  }

  closeError () {
    this.props.hasError(false, 0, '')
  }

  addOrchestrator () {
    let _this = this
    _this.setState({ showModal: false })
    async.series([
    function (callback) {
      _this.props.isSynced(false, 0, 'Configuring the contract to deploy...')
      let contract = {
        provider: _this.state.nodeXpub,
        user: _this.state.value,
        revocation: _this.state.value,
        representatives: '',
        recipe: {
          version: 0,
          content: [
          {
            checked: true,
            name: 0,
            value: '',
          },
          {
            checked: true,
            name: 1,
            value: '',
          },
          {
            checked: true,
            name: 2,
            value: '',
          },
          {
            checked: true,
            name: 3,
            value: '',
          },
          {
            checked: true,
            name: 4,
            value: '',
          },
          {
            checked: true,
            name: 5,
            value: '',
          },
          {
            checked: true,
            name: 6,
            value: '',
          },
          {
            checked: true,
            name: 7,
            value: '',
          },
          {
            checked: true,
            name: 8,
            value: '',
          },
          {
            checked: true,
            name: 9,
            value: '',
          },
          {
            checked: true,
            name: 10,
            value: '',
          },
          {
            checked: true,
            name: 11,
            value: '',
          },
          {
            checked: true,
            name: 12,
            value: '',
          },
          {
            checked: true,
            name: 13,
            value: '',
          },
          {
            checked: true,
            name: 14,
            value: '',
          },
          {
            checked: true,
            name: 15,
            value: '',
          },
          {
            checked: true,
            name: 16,
            value: '',
          },
          {
            checked: true,
            name: 17,
            value: '',
          },
          {
            checked: true,
            name: 18,
            value: '',
          },
          {
            checked: true,
            name: 19,
            value: '',
          },
          {
            checked: true,
            name: 20,
            value: '',
          },
          {
            checked: true,
            name: 21,
            value: '',
          },
          {
            checked: true,
            name: 22,
            value: '',
          },
          {
            checked: true,
            name: 23,
            value: '',
          },
          {
            checked: true,
            name: 24,
            value: '',
          },
          {
            checked: true,
            name: 25,
            value: '',
          },
          {
            checked: true,
            name: 26,
            value: '',
          },
          {
            checked: true,
            name: 27,
            value: '',
          },
          {
            checked: true,
            name: 28,
            value: '',
          },
          {
            checked: true,
            name: 29,
            value: '',
          },
          {
            checked: true,
            name: 30,
            value: '',
          },
          {
            checked: true,
            name: 31,
            value: '',
          }
          ]
        }
      }
      Orchestrator.buildTx('orchestration', contract, _this.props.isSynced, callback)
    }
    ], function (err, res) {
      if (err) return err
      if (res[0].code === 0) {
        let obj = {
          paths: res[0].paths,
          tx: res[0].message
        }
        let JSONres = JSON.stringify(obj)

        let msg = {
          user_name: _this.state.label,
          provider_name: _this.state.nodeName,
          context_name: 'Office',
          tx: JSONres,
          permission: {
            type: 'Orchestration',
            recipe: ''
          },
          timestamp_born: moment().valueOf(),
          timestamp_expiration: moment().valueOf(),
          annulment: {
            name: _this.props.user.name,
            address: res[0].annulment.address,
            path: res[0].annulment.path
          }
        }
        let msgStringified = JSON.stringify(msg)
        _this.props.isSynced(true, 100, '')
        _this.props.isSynced(false, 0, 'The contract is ready to be signed and broadcasted...')
        _this.props.sendMessage(uidMethods.SEND_CONTRACT, msgStringified, 'SEND_CONTRACT')
      } else if (res[0].code === -1) {
        _this.props.isSynced(true, 100, '')
        _this.props.hasError(true, res[0].message, '')
      }
    })
  }

  handleOpenModal (nodeXpub, nodeName) {
    this.setState({
      showModal: true,
      nodeXpub: nodeXpub,
      nodeName: nodeName
    })
  }

  handleCloseModal () {
    this.setState({ showModal: false })
  }

  selectOrchestrator (value) {
    let _this = this
    if (value === null) {
      _this.setState({
        label: '',
        value: ''
      })
    } else {
      this.setState({
        label: value.label,
        value: value.value
      })
    }
  }

  handleChange (event) {
    this.setState({filterNodes: event.target.value})
  }

  componentDidMount () {
    if (this.props.status !== 'Connected') {
      browserHistory.replace('/')
      window.location.reload()
    } else {
      console.log('questo lo fa?')
      this.props.sendMessage(uidMethods.GET_NODES, '', 'GET_NODES')
    }
  }

  render () {
    let options = []
    let orchestrator = {
      value: this.props.user.xpub,
      label: this.props.user.name
    }
    options.push(orchestrator)
    return (
      <div>
        <HeaderContext
          totalNodes={this.props.nodes.length}
          name='Asset Directory'
          baseRoute={'/o'}
          path={this.props.location.pathname}
        />
        <AssetDirectoryBody
          filterText={this.state.filterNodes}
          nodes={this.props.nodes}
          handleChange={this.handleChange}
          visible={this.state.visible}
          toggle={this.toggleSearch}
          imprintedNodes={this.props.imprintedNodes}
          handleOpenModal={this.handleOpenModal}
          checkConfirmation={this.checkConfirmation}
          updateConfirmations={this.props.updateConfirmations}
          selectedNodes={this.props.selectedNodes}
          filter={this.props.filter}
        />
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel='Create orchestrator contract'
        >
          <h4>Select the orchestrator</h4>
          <p>Seleziona quale device può orchestrare la machine</p>
          <Select
            options={options}
            name='orchestrator_search'
            value={this.state.value}
            onChange={this.selectOrchestrator}
          />
          <div className='tx_actions'>
            <button onClick={this.addOrchestrator} className='buildTx'>Create contract</button>
            <button onClick={this.handleCloseModal} className='button_close'>cancel</button>
          </div>
        </ReactModal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.connection.auth,
    nodes: state.nodes,
    contracts: state.contracts.all,
    user: state.user,
    feedback: state.feedback,
    status: state.connection.status,
    isFetching: state.nodes.isFetching,
    graphData: state.graph,
    contexts: state.contexts,
    synced: state.connection.synced,
    ws: state.connection.ws,
    imprintedNodes: state.imprintedNodes,
    selectedNodes: state.selectedNodes,
    filter: state.filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateConfirmations: (id, confirmations) => {
      dispatch(updateConfirmationsAction(id, confirmations))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssetDirectory)
