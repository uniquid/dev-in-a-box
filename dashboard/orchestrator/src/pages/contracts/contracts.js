import React, {Component} from 'react'
import Filter from '../../components/filter/filter'
import Table from '../../components/table'
import UModal from '../../components/modal'
import { Line } from 'rc-progress'

class Contracts extends Component {
  state = {
    filteredNodes: [],
    selectedNodes:[]
  }
  // componentDidMount (){
  //   this.props.getData()
  // }

  componentWillUnmount() {
    this.setState({
      filteredNodes: []
    })
  }

  setFiltered = (nodes) => {
    return this.setState({
      filteredNodes: nodes
    })
  }

  setSelectedNodeIds (node_ids) {
    const selectedNodes = this.state.filteredNodes.filter(node => node_ids.includes(node.txid))
    this.setState({
      selectedNodes
    })
  }

  render () {
    return (
      <div className='page page_contract'>
        <Filter
          filtered={this.setFiltered.bind(this)}
          data={this.props.contracts || []}
          filters={['status']}
          statusNames={['active','pending','revoked']}/>
        />
        <Table
          nodes={this.state.filteredNodes.map(contract => {
            return {
              user: contract.user.name,
              type: contract.recipe,
              provider: contract.provider.name,
              revoker: contract.revoker.name,
              status: contract.status,
              timestamp: contract.timestamp,
              id: contract.txid
            }
          })}
          selectedNodes={this.setSelectedNodeIds.bind(this)}
          refresh={this.props.getData}
          values={['user', 'type', 'provider', 'revoker', 'status', 'date']}
          body={'contracts'}
          classe={'contracts'}
          headActions={[{title: 'Revoke', class: '', state: 'deleteContractModalStatus', action: this.props.manageModal(this.state.selectedNodes)}]}
        />
        <UModal
          title='Delete Contracts'
          refs='orchestrate'
          open={this.props.deleteContractModalStatus}
          manageModal={this.props.manageModal}
          actions={false}
          body={
            <div>
              You are revoking <b>{this.props.modalNodes.length}</b> contracts
              <div className='modal_actions'>
                <button className='actions_proceed' onClick={() => this.props.deleteTx(this.props.modalNodes)}>Proceed</button>
                <button className='actions_cancel' onClick={() => this.props.manageModal()('deleteContractModalStatus', false)} >Cancel</button>
              </div>

              <div className={'orchestration_status ' + this.props.txStatusModal}>
                <h5 className='status_title'>Contracts status</h5>
                <div className='status_bar'>
                  <Line percent={this.props.status.length * 100 / this.props.modalNodes.length} strokeWidth='2' strokeColor='#3FC7FA' />
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
                  <button className='actions_cancel' onClick={() => this.props.manageModal()('deleteContractModalStatus', false)} >Close</button>
                </div>
              </div>
            </div>
          }
        />
      </div>
    )
  }
}

export default Contracts
