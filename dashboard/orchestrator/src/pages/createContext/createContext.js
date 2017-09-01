import React, { Component } from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import {connect} from 'react-redux'
import {createNewContext} from '../../core/actions/contexts'
import ContextForm from '../../modules/createContext.modules/contextForm'
import Header from '../../components/header/header'

class NewContext extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      owner: 'test',
      successNotificationActive: false,
      errorNotificationActive: false
    }
    this.addContext = this.addContext.bind(this)
    this.setName = this.setName.bind(this)
  }

  setName (event) {
    this.setState({
      name: event.target.value
    })
  }

  addContext () {
    
  }

  render () {
    return (
      <div className='App'>
        <Header
          user={this.props.user}
          connectionStatus={this.props.status}
        />
        <Sidebar
          contexts={this.props.contexts}
          palette={'ocean'}
        />
        {/* <HeaderContext name={'Create a new context'}/> */}
        <section id='wrapper'>
          <ContextForm name={this.state.name} setName={this.setName} addContext={this.addContext} />
        </section>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    contexts: state.contexts,
    user: state.user,
    status: state.connection.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAddContext: (info) => {
      dispatch(createNewContext(info))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewContext)
