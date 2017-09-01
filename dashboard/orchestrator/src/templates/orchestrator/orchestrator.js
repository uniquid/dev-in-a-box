import React from 'react'
import Header from '../../components/header/header'
import Sidebar from '../../components/sidebar/sidebar'
import Feedback from '../../components/feedback/feedback'

class OrchestratorTemplate extends React.Component {

  closeError () {
    this.props.hasError(false, 0, '')
  }

  render () {
    return (
      <div>
        <Feedback closeError={this.closeError.bind(this)} status={this.props.feedback.status} message={this.props.feedback.message} title={this.props.feedback.title} icon={this.props.feedback.icon} code={this.props.feedback.code} />
        <Header
          user={this.props.user}
          reconnect={this.props.reconnect}
          connectionStatus={this.props.status}
          name={'Home'}
        />
        <Sidebar
          contexts={this.props.contexts}
          palette={'ocean'}
        />
        <div id='wrapper'>
          {React.cloneElement(this.props.children, {
            sendMessage: this.props.sendMessage,
            isSynced: this.props.isSynced,
            addIp: this.props.addIp,
            updateConnectionStatus: this.props.updateConnectionStatus,
            addSocket: this.props.addSocket,
            sessionId: this.props.sessionId,
            hasError: this.props.hasError,
            error: this.props.error,
            auth: this.props.auth,
            nodes: this.props.nodes,
            resetStatus: this.props.resetStatus,
            updateStatus: this.props.updateStatus
          })}
        </div>
      </div>
    )
  }
}

export default OrchestratorTemplate
