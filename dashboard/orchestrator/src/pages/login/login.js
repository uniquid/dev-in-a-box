// @flow
import React, { Component } from 'react'
import qrCode from 'qrcode-npm'
import uuid from 'uuid'
import io from 'socket.io-client'
import history from '../../history'

import Matrix from './matrix'
import QrCode from './qrCode'
import HeaderNotLogged from './headerNotLogged'
import SocketWorker from '../../services/socket'

let socket = io('http://appliance4.uniquid.co:3000')

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      code: [],
      auth: false
    }
  }

  componentWillMount () {
    this.props.addSessionId(uuid.v1())
    socket.emit('message', this.props.sessionId)
  }

  componentDidMount () {
    if (sessionStorage.getItem('ip')) {
      this.props.verifyAuth(true)
      SocketWorker.open(sessionStorage.getItem('ip'), this.props.addSocket, this.props.updateConnectionStatus, sessionStorage.getItem('name'), this.receiveMessage.bind(this), this.props.hasError,this.props.addIp)
    }
  }
  receiveMessage (msg, validRequest) {
    if(msg.body.result === "true"){
      sessionStorage.setItem('ip', sessionStorage.getItem('_ip'));
      sessionStorage.setItem('session', sessionStorage.getItem('_session'));
      sessionStorage.setItem('name', sessionStorage.getItem('_name'));
      sessionStorage.removeItem('_ip');
      sessionStorage.removeItem('_session');
      sessionStorage.removeItem('_name');
    }
    this.props.receiveMessage(msg, validRequest)
  }
  componentDidUpdate (prevProps) {
      let _this = this
      if (this.props.auth === true) {return history.replace('/')}

      if (prevProps.user.ip.length === this.props.user.ip.length && this.props.user.ip.length === 0) {
        socket.on(this.props.sessionId, function (msg) {
          sessionStorage.setItem('_ip', msg.ip);
          sessionStorage.setItem('_session', msg.session_id);
          sessionStorage.setItem('_name', msg.name);
          _this.props.addIp(msg)
          _this.setState({auth: true})
        })
      }
      if (prevProps.user.ip.length !== this.props.user.ip.length && this.props.user.ip.length > 0) {
        SocketWorker.open(sessionStorage.getItem('_ip'), this.props.addSocket, this.props.updateConnectionStatus, sessionStorage.getItem('_name'), this.receiveMessage.bind(this), this.props.hasError,this.props.addIp)
      }
    }


  render () {
      let qr = qrCode.qrcode(7, 'M')
      qr.addData(this.props.sessionId)
      qr.make()
      return (
        <div className='index_wrapper'>
          <div className='console_background' />
          <HeaderNotLogged />
          <div className='row'>
            <div className='medium-8 columns medium-offset-2'>
            <QrCode
              visibility={this.state.auth}
              sessionQrcode={qr.createImgTag(4)}
            />
            <Matrix
                visibility={this.state.auth}
                registerPinCode={this.registerPinCode}
                resetCode={this.resetCode}
                sendMessage={SocketWorker.send}
                addItemToTail={this.props.addItemToTail}
                socket={this.props.socket}
             />
            </div>
          </div>
        </div>
      )
  }
}

export default Login
