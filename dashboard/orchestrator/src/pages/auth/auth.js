import React, {Component} from 'react'
import uidMethods from '../../uidMethods'
import {browserHistory} from 'react-router'

class Auth extends Component {
  constructor () {
    super()
    this.state = {
      code: []
    }
    this.registerPinCode = this.registerPinCode.bind(this)
    this.resetCode = this.resetCode.bind(this)
  }

  resetCode () {
    this.setState({code: []})
    this.refs.pin_1.value = ''
    this.refs.pin_2.value = ''
    this.refs.pin_3.value = ''
    this.refs.pin_4.value = ''
  }

  componentDidUpdate (prevProps) {
    if (prevProps.auth !== this.props.auth) {
      browserHistory.replace('/')
    }
  }

  registerPinCode (code) {
    if (this.state.code.length < 4) {
      this.state.code.push(code)
      if (this.state.code.length === 1) {
        this.refs.pin_1.value = this.state.code[0]
      }
      if (this.state.code.length === 2) {
        this.refs.pin_2.value = this.state.code[1]
      }
      if (this.state.code.length === 3) {
        this.refs.pin_3.value = this.state.code[2]
      }
      if (this.state.code.length === 4) {
        this.refs.pin_4.value = this.state.code[3]
      }
    }
    if (this.state.code.length === 4) {
      let code = this.state.code.join('')
      this.props.sendMessage(uidMethods.VERIFY_AUTH, code, 'VERIFY_AUTH')
    }
  }

  render () {
    return (
      <div className='index_wrapper'>
        <div className='console_background' />
        <header className='wrapper_header'>
          <div className='header_logo' />
          <div className='header_right'>
            <ul>
              <li><a>Paper</a></li>
              <li><a>FAQ</a></li>
              <li><a>Contact us</a></li>
              <li><a><span className='icon-twitter' /></a></li>
              <li><a><span className='icon-medium' /></a></li>
              <li><a><span className='icon-github' /></a></li>
            </ul>
          </div>
        </header>
        <div className='row'>
          <div className='medium-8 columns medium-offset-2'>
            <section className='wrapper_qrcode'>
              <h1 className='qrcode_title'>AUTH VERIFICATION</h1>
              <h3 className='qrcode_tagline'>Insert the PIN code displayed on your smartphone <br />on the pad above accorded to the matrix</h3>
              <div className='pin_matrix'>
                <div className='matrix_column'>
                  <div className='matrix_input' onClick={() => this.registerPinCode(1)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(2)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(3)}>
                    <span className='icon-plus' />
                  </div>
                </div>
                <div className='matrix_column'>
                  <div className='matrix_input' onClick={() => this.registerPinCode(4)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(5)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(6)}>
                    <span className='icon-plus' />
                  </div>
                </div>
                <div className='matrix_column'>
                  <div className='matrix_input' onClick={() => this.registerPinCode(7)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(8)}>
                    <span className='icon-plus' />
                  </div>
                  <div className='matrix_input' onClick={() => this.registerPinCode(9)}>
                    <span className='icon-plus' />
                  </div>
                </div>
              </div>
              <div className='pin_sequence'>
                <input className='sequence_input' maxLength='1' pattern='[0-9]*' type='password' name='pin_sequence_1' ref='pin_1' size='3' placeholder='·' readOnly tabIndex='2'/>
                <input className='sequence_input' maxLength='1' pattern='[0-9]*' type='password' name='pin_sequence_2' ref='pin_2' size='3' placeholder='·' readOnly tabIndex='3'/>
                <input className='sequence_input' maxLength='1' pattern='[0-9]*' type='password' name='pin_sequence_3' ref='pin_3' size='3' placeholder='·' readOnly tabIndex='4'/>
                <input className='sequence_input' maxLength='1' pattern='[0-9]*' type='password' name='pin_sequence_4' ref='pin_4' size='3' placeholder='·' readOnly tabIndex='5'/>
              </div>
              <button onClick={() => this.resetCode()} className='reset_pin'>Reset code</button>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default Auth
