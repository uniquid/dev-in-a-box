import React, {Component} from 'react'
import qrCode from 'qrcode-npm'
import uuid from 'uuid'
import io from 'socket.io-client'
let socket = io('http://appliance4.uniquid.co:3000')
import {browserHistory} from 'react-router'
import {connect} from 'react-redux'
import {addIpAction} from '../../core/actions/connection'

class Index extends Component {
  componentDidMount () {
    let _this = this
    socket.on('message', function (msg) {
      // Dispatch action to save in state id
      console.log(msg)
      _this.props.addIp(msg)
      browserHistory.replace('/auth')
    })
  }

  sendMessage (message) {
      socket.emit('message', message)
  }

  render () {
    let sessionId = uuid.v1()
    this.sendMessage(sessionId)
    let qr = qrCode.qrcode(7, 'M')
    qr.addData(sessionId)
    qr.make()
    let sessionQrcode = qr.createImgTag(4)
    return (
      <div className='index_wrapper'>
        <header className='wrapper_header'>
          <div className='header_logo'></div>
          <div className='header_right'>
            <ul>
              <li><a>Paper</a></li>
              <li><a>FAQ</a></li>
              <li><a>Contact us</a></li>
              <li><a><span className='icon-twitter'></span></a></li>
              <li><a><span className='icon-medium'></span></a></li>
              <li><a><span className='icon-github'></span></a></li>
            </ul>
          </div>
        </header>
        <div className='row'>
          <div className='medium-8 columns medium-offset-2'>
            <section className='wrapper_qrcode'>
              <h1 className='qrcode_title'>Blockchain access management</h1>
              <h3 className='qrcode_tagline'>Protect your digital connected assets inside <br /> a network of smart devices and people</h3>
              <div className='qrcode_body' dangerouslySetInnerHTML={{__html: sessionQrcode}}></div>
              <p className='qrcode_instruction'>Scan the QRcode above with the Uniquid app to Login</p>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addIp: (ip) => {
      dispatch(addIpAction(ip))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
