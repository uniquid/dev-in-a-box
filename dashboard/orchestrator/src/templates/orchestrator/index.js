import { connect } from 'react-redux'
import {getNodesAction} from '../../core/actions/nodes'
import OrchestratorTemplate from './orchestrator'
import {hasErrorAction} from '../../core/actions/feedback'

const mapStateToProps = (state) => {
  return {
    auth: state.connection.auth,
    status: state.connection.status,
    synced: state.connection.synced,
    user: state.user,
    imprintedNodes: state.imprintedNodes,
    contexts: state.contexts,
    nodes: state.nodes,
    feedback: state.feedback
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAllNodes: (nodes) => {
      dispatch(getNodesAction(nodes))
    },
    hasError: (status, icon, title, message, retry) => {
      dispatch(hasErrorAction(status, icon, title, message, retry))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrchestratorTemplate)
