import {connect} from 'react-redux'
// import {getNodesAction} from '../../core/actions/nodes'
import {hasErrorAction} from '../../core/actions/feedback'
import {getNodesAction} from '../../core/actions/nodes'
import {updateStatusAction, resetStatusAction} from '../../core/actions/status'
import {
  addCurrentContractAction,
  deleteContractAction,
  getContractsAction,
  toggledContract
} from '../../core/actions/contracts'
import {
  addProviderAction,
  addUserAction
} from '../../core/actions/contractCreator'
import Component from './context'

const mapStateToProps = (state) => {
  return {
    contractStatus: state.status,
    nodes: state.nodes,
    contracts: state.contracts,
    // status: state.connection.status,
    contexts: state.contexts,
    activeContract: state.contractCreator,
    selectedNodes: state.selectedNodes,
    status: state.status,
    // filter: state.filter,
    toggledControlled: state.toggledControlled
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllNodes: (nodes) => {
      dispatch(getNodesAction(nodes))
    },
    currentContract: (contract) => {
      dispatch(addCurrentContractAction(contract))
    },
    // CONTRACTS
    getAllContracts: (contracts) => {
      dispatch(getContractsAction(contracts))
    },

    onContractDeleted: (id) => {
      dispatch(deleteContractAction(id))
    },
    onToggleContract: (id) => {
      dispatch(toggledContract(id))
    },
    hasError: (status, message, code) => {
      dispatch(hasErrorAction(status, message, code))
    },
    // CONTRACT CREATOR
    onAddProvider: (provider) => {
      dispatch(addProviderAction(provider))
    },
    updateStatus: (message, status) => {
      dispatch(updateStatusAction(message, status))
    },
    onAddUser: (user) => {
      dispatch(addUserAction(user))
    },
    resetStatus: () => {
      dispatch(resetStatusAction())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
