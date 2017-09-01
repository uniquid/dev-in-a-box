import {connect} from 'react-redux'
import Login from './login'
import {addSocketAction, addSessionIdAction, updateConnectionAction, verifyAuthAction} from '../../core/actions/connection'
import {addIpAction} from '../../core/actions/user'
import {hasErrorAction} from '../../core/actions/feedback'
import {receiveMessageAction} from '../../core/actions/socket'

const mapStateToProps = (state) => {
  return {
    auth: state.connection.auth,
    status: state.connection.status,
    synced: state.connection.synced,
    user: state.user,
    imprintedNodes: state.imprintedNodes,
    socket: state.connection.ws,
    contexts: state.contexts,
    sessionId: state.connection.sessionId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addIp: (data) => {
      dispatch(addIpAction(data))
    },
    addSocket: (socket) => {
      dispatch(addSocketAction(socket))
    },
    verifyAuth: (auth) => {
      dispatch(verifyAuthAction(auth))
    },
    receiveMessage: (msg, req) => {
      dispatch(receiveMessageAction(msg, req))
    },
    addSessionId: (val) => {
      dispatch(addSessionIdAction(val))
    },
    hasError: (status, message, code, title, icon) => {
      dispatch(hasErrorAction(status, message, code, title, icon))
    },
    updateConnectionStatus: (res) => {
      dispatch(updateConnectionAction(res))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
