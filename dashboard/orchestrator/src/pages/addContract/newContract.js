import React from 'react'
import Head from './head'
import NodesList from './NodesList'
import PropTypes from 'prop-types'
import UModal from '../../components/modal'
import { Line } from 'rc-progress'
import Filter from '../../components/filter/filter'
import Table from '../../components/table'

class NewContract extends React.Component {
  state = {
    filteredNodes: {
      users:[],
      provider:[]
    },
    selectedNodes: {
      users:[],
      provider:[]
    }
  }

    setFiltered = (what, nodes) => {
      this.state={
        ...this.state,
        filteredNodes: {
          ...this.state.filteredNodes,
          [what]:nodes
        }
      };
      return this.setState(this.state)
    }

    selectedNodes = (what, nodes) => {
      this.state={
        ...this.state,
        selectedNodes: {
          ...this.state.selectedNodes,
          [what]:nodes
        }
      };
      return this.setState(this.state)
    }

  componentDidMount () {
    this.props.getData()
  }

  render () {
    console.log(this.state)
    return (
      <div className='page page-newContract'>
        <Head
          selectedUser={this.state.selectedNodes.users}
          selectedProvider={this.state.selectedNodes.provider}
          sendContract={()=>this.props.manageModal(this.state.selectedNodes.users)('createContractModalStatus', true)}
        />
        <div className='row'>
          <div className='medium-4 medium-offset-2 columns'>
            <Filter
              filtered={this.setFiltered.bind(this, 'users')}
              data={this.props.nodes || []}
              filters={['name']}/>
            />
            <Table
              nodes={this.state.filteredNodes.users.map(node => {
                return {
                  name: node.name,
                  id: node.xpub
                }
              })}
              refresh={this.props.getData}
              values={['name']}
              body={'imprintedNodes'}
              classe={'user'}
              selectedNodes={this.selectedNodes.bind(this, 'users')}
            />
          </div>
          <div className='medium-4 end columns'>
            <Filter
              filtered={this.setFiltered.bind(this, 'provider')}
              data={this.props.nodes || []}
              filters={['name']}/>
            />
            <Table
              radio={true}
              nodes={this.state.filteredNodes.provider.map(node => {
                return {
                  name: node.name,
                  id: node.xpub
                }
              })}
              refresh={this.props.getData}
              values={['name']}
              body={'imprintedNodes'}
              classe={'user'}
              selectedNodes={this.selectedNodes.bind(this, 'provider')}
            />
          </div>

        </div>
          <UModal
            title='Create Contract'
            refs='orchestrate'
            open={this.props.createContractModalStatus}
            manageModal={this.props.manageModal}
            actions={false}
            body={
              <div>
              You are creating <b>{this.state.selectedNodes.users.length}</b> new contracts
                <div className='modal_actions'>
                  <button className='actions_proceed' onClick={() => this.props.sendTx(this.state.selectedNodes.users, this.state.selectedNodes.provider[0])}>Proceed</button>
                  <button className='actions_cancel' onClick={() => this.props.manageModal()('createContractModalStatus', false)} >Cancel</button>
                </div>

                <div className={'orchestration_status ' + this.props.txStatusModal}>
                  <h5 className='status_title'>Contracts status</h5>
                  <div className='status_bar'>
                    <Line percent={this.props.status.length * 100 } strokeWidth='2' strokeColor='#3FC7FA' />
                  </div>
                  <div className='status_info row collapse'>
                    <div className='medium-6 columns'>
                      <div className='info_box'>
                        <h3>{this.props.status.filter(st => st.status === 200).length}</h3>
                        <span>correct</span>
                      </div>
                    </div>
                    <div className='medium-6 columns'>
                      <div className='info_box'>
                        <h3>{this.props.status.filter(st => st.status !== 200).length}</h3>
                        <span>errors</span>
                      </div>
                    </div>
                  </div>
                  <div className='status_log'>
                    <h4 className='log_title'>Status Log</h4>
                    <div className="log_body">
                      {this.props.status.map((status, i) => (
                        <div key={i} className='log_item'>
                          {status.message}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='modal_actions'>
                    <button className='actions_cancel' onClick={() => this.props.manageModal()('createContractModalStatus', false)} >Close</button>
                  </div>
                </div>
              </div>
            }
          />
      </div>
    )
  }
}

NewContract.propTypes = {
  sendTransaction: PropTypes.func,
  handleUserChange: PropTypes.func,
  filterUser: PropTypes.string,
  nodes: PropTypes.array,
  selectUser: PropTypes.func,
  handleProviderChange: PropTypes.func,
  filterProvider: PropTypes.string,
  selectProvider: PropTypes.func
}

export default NewContract
