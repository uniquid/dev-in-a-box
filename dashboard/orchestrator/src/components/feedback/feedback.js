import React, {Component} from 'react'

class Feedback extends Component {
  constructor () {
    super()
    this.handleBar = this.handleBar.bind(this)
    this.state = {
      open: false
    }
  }

  handleBar () {
    this.setState({
      open: !this.state.open
    })
  }

  render () {
    return (
        <div className='feedback_container'>
            <section id='feedback_modal' className={this.props.status ? 'active' : ''} >
                <span className={this.props.icon} />
                <h2 className='feedback_title'>{this.props.title}</h2>
                <p className='feedback_description'>{this.props.message}</p>
                <div className='feedback_actions'>
                    <button onClick={() => this.props.closeError()} className='actions_close'>Close</button>
                  </div>
              </section>
          </div>
      )
  }
}

export default Feedback
