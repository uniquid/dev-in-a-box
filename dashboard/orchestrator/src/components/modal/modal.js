import React, {Component} from 'react'
import Modal from 'react-modal'

class UModal extends Component {
  render () {
    return (
      <Modal ref={this.props.refs}
        id={this.props.refs}
        contentLabel={this.props.refs}
        closeTimeoutMS={150}
        isOpen={this.props.open}
        onAfterOpen={() => { }}
        onRequestClose={() => { this.props.manageModal(this.props.refs, false) }}
        portalClassName={'ReactModalPortal ' + this.props.refs}
      >
        <h4>{this.props.title}</h4>
        {this.props.body}
        {this.props.actions ? (<div className='modal_actions'>
          {this.props.proceed ? (<button className='actions_proceed' onClick={() => { this.props.proceed() }}>Proceed</button>) : '' }
          <button className='actions_cancel' onClick={() => this.props.manageModal(this.props.refs, false)} >Cancel</button>
        </div>) : '' }
      </Modal>
    )
  }
}

export default UModal
