import React, {Component} from 'react'
import { Steps, Step } from 'react-multistep-component'
import StepOne from '../../modules/contract.step/guarantor.step.one'
import StepThree from '../../modules/contract.step/guarantor.step.two'
import Orchestrator from '../../components/bitcoinManager/orchestrator'
import async from 'async'
import uidMethods from '../../uidMethods'

class Guarantor extends Component {
  constructor () {
    super()
    this.state = {
      contract: {
        provider: {
          name: '',
          xpub: ''
        },
        user: {
          name: '',
          xpub: ''
        },
        orchestrator: {
          name: '',
          xpub: ''
        },
        recipe: [],
        representatives: []
      },
      value: [],
      filterNodes: '',
      filterGuaranteedNodes: ''
    }
    this.selectProvider = this.selectProvider.bind(this)
    this.selectUser = this.selectUser.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleChangeGuaranteed = this.handleChangeGuaranteed.bind(this)
    this.createTransaction = this.createTransaction.bind(this)
  }

  createTransaction () {
    let _this = this
    async.series([
      function (callback) {
        Orchestrator.buildTx(_this.state.contract.provider.xpub, _this.state.contract.user.xpub, '', _this.props.xpubContext[0], _this.state.contract.recipe, callback)
      }
    ], function (err, res) {
      if (err) {
        return err
      }
      console.log(res[0])
      let msgStringified = JSON.stringify(res[0])
      console.log(msgStringified)
      _this.props.sendMessage(uidMethods.sendContract, res[0], 'sendContract')
    })
  }

  handleChange (event) {
    this.setState({filterNodes: event.target.value})
  }

  handleChangeGuaranteed (event) {
    this.setState({filterGuaranteedNodes: event.target.value})
  }

  selectProvider (event) {
    let selectedProvider = this.props.nodes[0].list.filter(node => node.xpub === event.target.value)
    let newContract = Object.assign({}, this.state.contract)
    newContract.provider.name = selectedProvider[0].name
    newContract.provider.xpub = selectedProvider[0].xpub
    this.setState({
      contract: newContract
    })
  }

  selectUser (event) {
    let selectedUser = this.props.nodes[0].list.filter(node => node.xpub === event.target.value)
    let newContract = Object.assign({}, this.state.contract)
    newContract.user.name = selectedUser[0].name
    newContract.user.xpub = selectedUser[0].xpub
    console.log(newContract)
    this.setState({
      contract: newContract
    })
  }


  render () {
    return (
      <div className='page page-newContract'>
        <div className='row fullWidth'>
          <Steps prevButton={'back'} nextButton={'Next'} >
            <Step>
              <StepOne
                name={this.props.name}
                filterGuaranteedNodes={this.state.filterGuaranteedNodes}
                filterText={this.state.filterNodes}
                nodes={this.props.nodes[0].list}
                selectProvider={this.selectProvider}
                selectUser={this.selectUser}
                providerSelected={this.state.contract.provider}
                handleChange={this.handleChange}
                handleChangeGuaranteed={this.handleChangeGuaranteed}
              />
            </Step>
            <Step>
              <StepThree
                name={this.props.name}
                createTransaction = {this.createTransaction}
                contract = {this.state.contract}
              />
            </Step>
          </Steps>
        </div>
      </div>
    )
  }
}

export default Guarantor
