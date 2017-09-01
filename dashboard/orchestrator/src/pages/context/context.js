import React, { Component } from 'react'
import HeaderContext from '../../modules/context.modules/menuContext'
import {browserHistory} from 'react-router'
import OrchestratorWorker from '../../services/orchestrator'
import {mapSeries} from 'async'
import {logout} from '../../services/user'

class Context extends Component {

  constructor () {
    super()
    this.state = {
      value: [],
      filterUser: '',
      filterProvider: '',
      createContractModalStatus: false,
      deleteContractModalStatus: false,
      txStatusModal: false,
      modalNodes:[]
    }
    this.getData = this.getData.bind(this)
    this.selectProvider = this.selectProvider.bind(this)
    this.selectUser = this.selectUser.bind(this)
    this.handleUserChange = this.handleUserChange.bind(this)
    this.handleProviderChange = this.handleProviderChange.bind(this)
    this.sendTx = this.sendTx.bind(this)
    this.deleteTx = this.deleteTx.bind(this)
    this.getAllContracts = this.getAllContracts.bind(this)
    this.getAllNodes = this.getAllNodes.bind(this)
    this.manageModal = this.manageModal.bind(this)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.contexts.length > 0) {
      if (nextProps.contexts.findIndex(ctx => ctx.name === nextProps.params.name) === -1) {
        browserHistory.replace('/err')
      }
    }
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
      this.setState({ ...this.state,modalNodes:nodes, [param]: status })
    }
  }

  getAllNodes () {
    let _this = this
    return OrchestratorWorker.get('nodes')
      .then(res => _this.props.getAllNodes(res.data))
      .catch(() => _this.props.hasError(true, 'It was impossible to retrieve the nodes list', 80, 'The server is unreacheable', 'icon-cross2'))
  }

  getAllContracts () {
    let _this = this
    return OrchestratorWorker.get('contracts')
      .then(res => _this.props.getAllContracts(res.data))
      .catch(() => _this.props.hasError(true, 'It was impossible to retrieve the contracts list', 80, 'The server is unreacheable', 'icon-cross2'))
  }

  deleteTx (contracts) {
    let chunk = 10
    let nodes = []
    let _this = this
    for (let i = 0; i < contracts.length; i += chunk) {
      nodes[i / chunk] = []
      for (let j = 0; j < chunk; j++) {
        if (contracts[i + j]) {
          nodes[i / chunk][j] = contracts[i + j]
        }
      }
    }
    this.setState({ ...this.state, txStatusModal: 'active' })
    nodes.map(group => {
      mapSeries(
        group,
        function (contract, cb) {
          OrchestratorWorker.delete('contracts', {txid: contract.txid})
          .then(res => {
            _this.props.updateStatus('🎉' + ' ' + `The contract between user ${_this.props.activeContract.user.name} and provider ${_this.props.activeContract.provider.name} has been correctly deployed!`, 200)
            cb(null, 'work')
          })
          .catch(() => {
            _this.props.updateStatus('💔' + ' ' + `The contract between user ${_this.props.activeContract.user.name} and provider ${_this.props.activeContract.provider.name} has failed`, 400)
            cb(null, 'err')
          })
        },
        function (err, results) {
          _this.getAllContracts()
        }
      )
    })
  }

  sendTx (users, provider) {
    let chunk = 10
    let nodes = []
    let _this = this
    for (let i = 0; i < users.length; i += chunk) {
      nodes[i / chunk] = []
      for (let j = 0; j < chunk; j++) {
        if (users[i + j]) {
          nodes[i / chunk][j] = users[i + j]
        }
      }
    }
    this.setState({ ...this.state, txStatusModal: 'active' })
    nodes.map(group => {
      mapSeries(
        group,
        function (xpub, cb) {
          OrchestratorWorker.post('contracts', {
            user: xpub,
            provider: provider
          })
          .then(res => {
            _this.props.updateStatus('🎉' + ' ' + `The contract between user ${_this.props.activeContract.user.name} and provider has been correctly deployed!`, 200)
            cb(null, 'work')
          })
          .catch(() => {
            _this.props.updateStatus('💔' + ' ' + `The contract between user ${_this.props.activeContract.user.name} and provider has failed`, 400)
            cb(null, 'err')
          })
        },
        function (err, results) {
          _this.getAllContracts()
        }
      )
    })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.feedback !== this.props.feedback && this.props.feedback.code === 0) {
      return browserHistory.replace('/context/' + this.props.name)
    }
  }

   handleUserChange (event) {
    // Il macro selettore viene settato su false
    this.props.toggleController(false)
    // I nodi selezionati in precedenza vengono settati su false
    this.props.resetNodesSelection()
    // Aggiorno lo stato con il filtro selezionato
    this.setState({filterUser: event.target.value})
    this.props.updateFilter('name', event.target.value)
  }

  handleProviderChange (event) {
    // Il macro selettore viene settato su false
    this.props.toggleController(false)
    // I nodi selezionati in precedenza vengono settati su false
    this.props.resetNodesSelection()
    // Aggiorno lo stato con il filtro selezionato
    this.setState({filterProvider: event.target.value})
    this.props.updateFilter('name', event.target.value)
  }

  componentWillUnmount () {
    clearTimeout(this._poll_timeout)
    this._poll_timeout = null
    this.setState({
      value: [],
      filterNodes: ''
    })
  }

  selectProvider (event) {
    let selectedProvider = this.props.nodes
    .filter(node => node.xpub === event.target.value)
    .map(node => {
      return {
        ...node,
        id: node.xpub
      }
    })[0]
    this.props.onAddProvider(selectedProvider)
  }

  selectUser (event) {
    let selectedUser = this.props.nodes
    .filter(node => node.xpub === event.target.value)
    .map(node => {
      return {
        ...node,
        id: node.xpub
      }
    })[0]
    this.props.selectNodes(selectedUser)
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

  getData () {
    // if (this.props.status !== 'Connected') {
    //   browserHistory.replace('/')
    //   window.location.reload()
    // }
    return Promise.all([
      this.getAllNodes(),
      this.getAllContracts()
    ])
    // .catch((err)=>{
    //   alert('Connection broken\nWill logout')
    //   logout()
    // })
  }

  render () {
    return (
      <div className={this.props.location.pathname.indexOf('new') !== -1 ? 'App newContract' : 'App'}>
        <HeaderContext
          totalNodes={this.props.nodes.length}
          menu={[{name: 'contracts', total: this.props.contracts.length, icon: 'icon-archive'}]}
          name={this.props.params.name}
          actions
          path={this.props.location.pathname}
          baseRoute={'/o/context/' + this.props.params.name}
        />
        {React.cloneElement(this.props.children,
          {
            getData: this.getData,
            resetNodesSelection: this.props.resetNodesSelection,
            totalSelector: this.props.totalSelector,
            toggledControlled: this.props.toggledControlled,
            updateFilter: this.props.updateFilter,
            resetFilter: this.props.resetFilter,
            // NODES
            nodes: this.props.nodes,
            // CONTRACTS
            contracts: this.props.contracts,
            deleteContractModalStatus: this.state.deleteContractModalStatus,
            deleteTx: this.deleteTx,
            // CONTRACT CREATOR
            sendTx: this.sendTx,
            handleUserChange: this.handleUserChange,
            handleProviderChange: this.handleProviderChange,
            filterUser: this.state.filterUser,
            filterProvider: this.state.filterProvider,
            selectUser: this.selectUser,
            selectedNodes: this.props.selectedNodes,
            selectProvider: this.selectProvider,
            status: this.props.contractStatus,
            createContractModalStatus: this.state.createContractModalStatus,
            manageModal: this.manageModal,
            modalNodes:this.state.modalNodes,
            providerSelected: this.props.activeContract.provider.name,
            txStatusModal: this.state.txStatusModal,
            hasError: this.props.hasError
          }
        )}
      </div>
    )
  }
}

export default Context
