// @flow
import { connect } from 'react-redux'
import Home from './home'


const mapStateToProps = (state) => {
  return {
    auth: state.connection.auth,
    status: state.connection.status,
    synced: state.connection.synced,
    user: state.user,
    imprintedNodes: state.imprintedNodes,
    contexts: state.contexts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addIp: (data) => {
      dispatch(addIpAction(data))
    },
    addSessionId: (val) => {
      dispatch(addSessionIdAction(val))
    }
  }
}

export default Home
