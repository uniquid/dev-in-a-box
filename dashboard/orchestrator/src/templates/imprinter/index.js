import React, { Component } from 'react'
import Hero from '../../components/hero'
import { connect } from 'react-redux'
import {getAllNodesFromImprinterAction} from '../../core/actions/nodes'
import { getAllOrchestratorsAction } from '../../core/actions/orchestrators'
import { getBalanceAction, totalNodeInfoAction } from '../../core/actions/imprinter'
import { Line } from 'rc-progress'
import ImprinterWorker from '../../services/imprinter'
import {logout} from '../../services/user'
import Header from '../../components/header/header'
import UModal from '../../components/modal'
import Feedback from '../../components/feedback/feedback'
import {hasErrorAction} from '../../core/actions/feedback'
import {updateStatusAction, resetStatusAction} from '../../core/actions/status'

class ImprinterTemplate extends Component {
  constructor () {
    super()
    this.manageModal = this.manageModal.bind(this)
    this.closeStatus = this.closeStatus.bind(this)
    this.getData = this.getData.bind(this)
    this.addOrchestratorName = this.addOrchestratorName.bind(this)
    this.addOrchestratorXpub = this.addOrchestratorXpub.bind(this)
    this.addOrchestator = this.addOrchestator.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.getAllNodes = this.getAllNodes.bind(this)
    this.getAllOrchestrators = this.getAllOrchestrators.bind(this)
    this.selectOrchestrator = this.selectOrchestrator.bind(this)
    this.recoveryNodes = this.recoveryNodes.bind(this)
    this.deleteOrchestrator = this.deleteOrchestrator.bind(this)
    this.totalSelector = this.totalSelector.bind(this)
    this.toggleNodesList = this.toggleNodesList.bind(this)
    this.state = {
      addOrchestratorModal: false,
      orchestrationModal: false,
      txStatusModal: false,
      recoveryModal: false,
      toggleNodesList: false,
      modalNodes: [],
      newOrchestrator: {
        name: '',
        xpub: ''
      },
      transform: 'inactive',
      table: 'inactive'
    }
  }

  /* TOTAL SELECTOR */
  totalSelector (status, nodes) {
    this.props.toggleController(status)
    if (!this.props.toggledControlled) {
      let nodesToSelect = nodes
      .filter(node => this.props.filter.map(item => {
        if (item.type.length > 0) {
          return node[item.type]
          .toLowerCase()
          .indexOf(item.content)}})[0] !== -1)
          return this.props.selectAll(nodesToSelect)
    } else {
      return this.props.resetSelectedNodes()
    }
  }

  getAllNodes () {
    let _this = this
    return ImprinterWorker.get('nodes')
      .then(res => {
        _this.props.getAllNodes(res.data)
        _this.props.totalNodeInfo(res.data)
      })
      .catch(() => _this.props.hasError(true, 'It was impossible to retrieve the nodes list', 80, 'The server is unreacheable', 'icon-cross2'))
  }

  getAllOrchestrators () {
    let _this = this
    return ImprinterWorker.get('orchestrators')
      .then(res => _this.props.getAllOrchestrators(res.data))
      .catch(() => _this.props.hasError(true, 'It was impossible to retrieve the orchestrators list', 80, 'The server is unreacheable', 'icon-cross2'))
  }

  deleteOrchestrator (xpub) {
    let _this = this
    ImprinterWorker.delete('orchestrators/' + xpub)
    .then(res => _this.getAllOrchestrators())
  }
  componentWillUnmount () {
    clearTimeout(this._poll_timeout)
    this._poll_timeout = null
  }
  getData () {
    // if (this.props.status !== 'Connected') {
    //   browserHistory.replace('/')
    //   window.location.reload()
    // }
    return Promise.all([
      this.getBalance(),
      this.getAllNodes(),
      this.getAllOrchestrators()
    ])
    // .catch((err)=>{
    //   alert('Connection broken\nWill logout')
    //   logout()
    // })
  }
  componentDidMount () {
    this._poll_timeout = true
    const _get_data = () => {
      this.getData()
        .catch(()=>{})
        .then(()=>{
          if(this._poll_timeout){
            this._poll_timeout = setTimeout(_get_data,10000)
          }
        })
    }
    _get_data()
  }



  addOrchestator () {
    let _this = this
    ImprinterWorker.post('orchestrators/' + this.state.newOrchestrator.xpub, {
      name: this.state.newOrchestrator.name
    })
    .then(res => {
      ImprinterWorker.get('orchestrators')
      .then(res => {
        _this.props.getAllOrchestrators(res.data)
        _this.manageModal('addOrchestrator', false)
        _this.setState({
          ..._this.state,
          newOrchestrator: {
            name: '',
            xpub: ''
          }
        })
      })
    })
    .catch(() => {
      _this.manageModal('addOrchestrator', false)
      _this.props.hasError(true, 'The orchestrator was not added correctly', 80, 'The server is unreacheable', 'icon-cross2')
    })
  }

  /* IMPRINTER BALANCE */
  getBalance () {
    let _this = this
    return ImprinterWorker.get('nodeinfo')
      .then(res => _this.props.getBalance(res.data))
      .catch(() => _this.props.hasError(true, 'The balance was not updated correctly', 80, 'The server is unreacheable', 'icon-cross2'))
  }

   // OPEN CLOSE MODAL
  manageModal = (nodes) => (param, status) => {
    let _this = this
    if (status === false) {
      _this.props.resetStatus()
      this.setState({
        ...this.state,
        [param]: status,
        txStatusModal: false,
        modalNodes:[]
      })
    } else {
      this.setState({ ...this.state, modalNodes:nodes, [param]: status })
    }
  }

  closeStatus (param, status) {
    if (param === 'orchestrationModal') {
      this.setState({
        ...this.state,
        txStatusModal: false,
        orchestrationModal: status
      })
    } else {
      this.setState({
        ...this.state,
        txStatusModal: false,
        recoveryModal: status
      })
    }
  }

  /* ADD ORCHESTRATOR */
  addOrchestratorName (e) {
    event.preventDefault()
    let newOrch = Object.assign({}, this.state.newOrchestrator)
    newOrch.name = e.target.value
    this.setState({ ...this.state, newOrchestrator: newOrch })
  }

  addOrchestratorXpub (e) {
    event.preventDefault()
    let newOrch = Object.assign({}, this.state.newOrchestrator)
    newOrch.xpub = e.target.value
    this.setState({ ...this.state, newOrchestrator: newOrch })
  }

  recoveryNodes () {
    event.preventDefault()
    let _this = this
    let chunk = 10
    let nodes = []
    for (let i = 0; i < _this.state.modalNodes.length; i+=chunk) {
      nodes[i/chunk] = []
      for (let j=0; j < chunk; j++) {
        if (_this.state.modalNodes[i+j]) {
          nodes[i/chunk][j] = _this.state.modalNodes[i+j]
        }
      }
    }
    this.setState({ ...this.state, txStatusModal: 'active' })
    nodes.map(function (group) {
      group.map(function(xpub, i) {
        ImprinterWorker.post('recovery', {
          machine: xpub
        })
        .then(res => {
          _this.props.updateStatus(res)
        })
        .catch(err => {
          _this.props.updateStatus(err)
        })
      })

    })
  }

  /* SEND ORCHESTRATE */
  sendTx () {
    event.preventDefault()
    let _this = this
    let chunk = 10
    let nodes = []
    for (let i = 0; i < _this.state.modalNodes.length; i += chunk) {
      nodes[i / chunk] = []
      for (let j = 0; j < chunk; j++) {
        if (_this.state.modalNodes[i + j]) {
          nodes[i / chunk][j] = _this.state.modalNodes[i + j]
        }
      }
    }
    this.setState({ ...this.state, txStatusModal: 'active' })
    nodes.map(function (group) {
      group.map(function(xpub, i) {
        ImprinterWorker.post('orchestrate', {
          orchestrator: _this.state.selectedOrchestrator,
          machine: xpub.xpub
        })
        .then(function (res) {
          _this.props.updateStatus(`🎉  The contract for ${xpub.name} has been correctly deployed!`, 200)
        })
        .catch((err) => _this.props.updateStatus(`💔  The contract for ${xpub.name} has failed`, 400))
      })

    })
  }

  selectOrchestrator (e) {
    event.preventDefault()
    this.setState({ ...this.state, selectedOrchestrator: e.target.value })
  }

  closeError () {
    this.props.hasError(false, 0, '')
    // logout()
  }

  toggleNodesList () {
    this.setState({
      toggleNodesList: !this.state.toggleNodesList
    })
  }

  render () {
    let corrects = this.props.status.filter(st => st.status === 200).length
    let errs = this.props.status.filter(st => st.status !== 200).length
    let options = [<option key={'none'} value={''}>{'none'}</option>]
    this.props.orchestrators.map(orchestrator => options.push(<option key={orchestrator.xpub} value={orchestrator.xpub}>{orchestrator.name}</option>))
    return (
    <div>
      <Feedback closeError={this.closeError.bind(this)} status={this.props.feedback.status} message={this.props.feedback.message} title={this.props.feedback.title} icon={this.props.feedback.icon} code={this.props.feedback.code} />
      <Header
        user={this.props.user}
        reconnect={this.props.reconnect}
        connectionStatus={this.props.connectionStatus}
        name={'Home'}
      />
    <Hero
      manageModal={this.manageModal}
      imprinter={this.props.imprinter}
      transform={this.state.transform}
      status={this.props.status}
    />
    {React.cloneElement(this.props.children, {
      manageModal: this.manageModal,
      addOrchestratorName: this.addOrchestratorName,
      addOrchestratorXpub: this.addOrchestratorXpub,
      getAllNodes: this.props.getAllNodes,
      getData: this.getData,
      nodes: this.props.nodes,
      toggleController: this.props.toggleController,
      toggledControlled: this.props.toggledControlled,
      getAllOrchestrators: this.props.getAllOrchestrators,
      orchestrators: this.props.orchestrators,
      newOrchestrator: this.state.newOrchestrator,
      totalNodeInfo: this.props.totalNodeInfo,
      hasError: this.props.hasError,
      status: this.props.status,
      table: this.state.table,
      deleteOrchestrator: this.deleteOrchestrator,
      totalSelector: this.totalSelector

    })}
    <UModal
      title='Add a new orchestrator'
      refs='addOrchestratorModal'
      open={this.state.addOrchestratorModal}
      manageModal={this.manageModal}
      closeStatus={this.closeStatus}
      actions
      proceed={this.addOrchestator}
      body={
        <div>
          <div className='content_orchestrator'>
            <div className='orchestrator_info'>
              <span>Name</span>
              <o>{this.state.newOrchestrator.name}</o>
            </div>
            <div className='orchestrator_info'>
              <span>xPub</span>
              <o>{this.state.newOrchestrator.xpub}</o>
            </div>
          </div>
        </div>
      }
    />
    <UModal
      title='Confirm Orchestration'
      refs='orchestrate'
      open={this.state.orchestrationModal}
      manageModal={this.manageModal}
      actions={false}
      body={
        <div>
          You are orchestrating <b>{this.state.modalNodes.length}</b> new machines
          <span className='modal_seeAll' onClick={() => this.toggleNodesList()}>{this.state.toggleNodesList ? 'Hide All' : 'See All'}</span>
          <ul className={this.state.toggleNodesList ? 'modal_list' : 'modal_list hide'}>
            {this.state.modalNodes.map(node => (
              <li key={node.id}>{node.name}</li>
            ))}
          </ul>
          <span className='label_orchestration'>Select the orchestrator</span>
          <div className='orchestration_selection'>
            <select className='select' onChange={this.selectOrchestrator}>
            {options}
            </select>
          </div>
          <div className='modal_actions'>
            {this.state.selectedOrchestrator ? <button className='actions_proceed' onClick={() => this.sendTx()}>Proceed</button> : null}
            <button className='actions_cancel' onClick={() => this.manageModal()('orchestrationModal', false)} >Cancel</button>
          </div>
          <div className={'orchestration_status ' + this.state.txStatusModal}>
            <h5 className='status_title'>Orchestration status</h5>
            <div className='status_bar'>
              <Line percent={this.props.status.length * 100 / this.state.modalNodes.length} strokeWidth="2" strokeColor="#3FC7FA" />
            </div>
            <div className='status_info row collapse'>
              <div className='medium-6 columns'>
                <div className='info_box'>
                  <h3>{corrects}</h3>
                  <span>correct</span>
                </div>
              </div>
              <div className='medium-6 columns'>
                <div className='info_box'>
                  <h3>{errs}</h3>
                  <span>errors</span>
                </div>
              </div>
            </div>
            <div className='status_log'>
              <h4 className='log_title'>Status Log</h4>
              <div className="log_body">
                {this.props.status.map((status, i) => (
                  <div key={i} className='log_item'>
                  {status.message}
                  </div>
                ))}
              </div>
            </div>
            <div className='modal_actions'>
              <button className='actions_cancel' onClick={() => this.manageModal()('orchestrationModal', false)} >Close</button>
            </div>
          </div>
        </div>
      }
    />
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    feedback: state.feedback,
    nodes: state.nodesFromImprinter,
    orchestrators: state.orchestrators,
    toggledControlled: state.toggledControlled,
    imprinter: state.imprinter,
    connectionStatus: state.connection.status,
    status: state.status,
    blockchain: state.blockchain,
    selectedNodes: state.selectedNodes
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    hasError: (status, icon, title, message, retry) => {
      dispatch(hasErrorAction(status, icon, title, message, retry))
    },
    getAllNodes: (nodes) => {
      dispatch(getAllNodesFromImprinterAction(nodes))
    },
    totalNodeInfo: (nodes) => {
      dispatch(totalNodeInfoAction(nodes))
    },
    getAllOrchestrators: (nodes) => {
      dispatch(getAllOrchestratorsAction(nodes))
    },
    getBalance: (balance) => {
      dispatch(getBalanceAction(balance))
    },
    updateStatus: (message, status) => {
      dispatch(updateStatusAction(message, status))
    },
    resetStatus: () => {
      dispatch(resetStatusAction())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImprinterTemplate)
