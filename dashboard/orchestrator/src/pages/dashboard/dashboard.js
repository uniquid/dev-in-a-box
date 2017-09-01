import React, {Component} from 'react'
import ReactModal from 'react-modal'
import qrCode from 'qrcode-npm'
import async from 'async'
import Orchestrator from '../../components/bitcoinManager/orchestrator'

class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      showXpub: false,
      showAddress: false,
      address: ''
    }
    this.handleOpenModal = this.handleOpenModal.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
    this.handleOpenAddress = this.handleOpenAddress.bind(this)
    this.handleCloseAddress = this.handleCloseAddress.bind(this)
  }

  handleOpenModal () {
    this.setState({ showXpub: true })
  }

  handleCloseModal () {
    this.setState({ showXpub: false })
  }

  handleOpenAddress () {
    let _this = this
    this.setState({ showAddress: true })
    let xpub = this.props.xpubContext[0]
    async.series([
      function (callback) {
        Orchestrator.getAddressFromXpub(xpub, 1, 0, 1, callback)
      }
    ], function (err, res) {
      return _this.setState({address: res[0].address})

    })
  }

  handleCloseAddress () {
    this.setState({ showAddress: false })
  }

  render () {
    let qr = qrCode.qrcode(7, 'M')
    qr.addData(this.state.address)
    qr.make()
    let sessionQrcode = qr.createImgTag(4)
    return (
      <div className='page page-actitivies'>
        <div className='feed'>
           <div className='activities_info'>
             <div className='info'>
                <h4 className='info_title'>Balance</h4>
                <span className='info_value'>2.230</span>
             </div>
             <div className='info'>
                <h4 className='info_title'>Nodes</h4>
                <span className='info_value'>17</span>
             </div>
             <div className='info'>
                <h4 className='info_title contracts'>Contracts</h4>
                <span className='info_value'>214</span>
             </div>
            </div>
        </div>
        <ReactModal
          isOpen={this.state.showXpub}
          contentLabel='Show xpub'
        >
          <h4>Context xPub</h4>
          <div className='modal_amount'>
            <p>L' extended pubKey (xpub) contiene informazioni sensibili per la derivazione di indirizzi, è consigliato di non esporla pubblicamente.</p>
            <label htmlFor='xpub'>xPub</label>
            <input className='input_xpub' disabled id='xpub' placeholder='Insert Amount' value={this.props.xpubContext[0]}/>
          </div>
          <div className='tx_actions'>
            <button className='buildTx'>Copy</button>
            <button onClick={this.handleCloseModal} className='button_close'>cancel</button>
          </div>

        </ReactModal>
        <ReactModal
          isOpen={this.state.showAddress}
          contentLabel='Show xpub'
        >
          <h4>Receive bitcoins</h4>
          <div className='modal_amount'>
            <label htmlFor='address'>Address</label>
            <input className='input_address' disabled id='address' placeholder='Insert Amount' value={this.state.address}/>
          </div>
          <div className='modal_qrcode'>
          <div className='qrcode_body' dangerouslySetInnerHTML={{__html: sessionQrcode}}></div>
          </div>
          <div className='tx_actions'>
            <button onClick={this.handleCloseAddress} className='button_close'>cancel</button>
          </div>

        </ReactModal>
      </div>
    )
  }
}

export default Dashboard
