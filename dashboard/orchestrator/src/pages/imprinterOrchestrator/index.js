import React from 'react'
import Table from '../../components/table'

class ImprinterOrchestrator extends React.Component {
    state = {
    filteredNodes: []
  }

  setFiltered = (nodes) => {
    return this.setState({
      filteredNodes: nodes
    })
  }
  componentDidMount (){
    this.props.getData()
  }

  render () {
    return (
    <section className='machines_list'>
        <div className='form row'>
            <div className='medium-4 columns'>
                <div className='form_item orchestratorName'>
                    <label htmlFor='name'>Name</label>
                    <input onChange={this.props.addOrchestratorName} value={this.props.newOrchestrator.name} placeholder='Add name' id='name' />
                </div>
            </div>
            <div className='medium-4 columns'>
                <div className='form_item orchestratorXpub'>
                    <label htmlFor='xpub'>xPub</label>
                    <input onChange={this.props.addOrchestratorXpub} value={this.props.newOrchestrator.xpub} placeholder='Add xpub' id='xpub' />
                </div>
            </div>
            <button onClick={()=>{this.props.manageModal('addOrchestratorModal', true)}}>Add Orchestrator</button>
        </div>
        <Table
            noSelect={true}
            nodes={this.props.orchestrators}
            values={['name']}
            body={'orch_from_imprinter'}
            class={'orch_from_imprinter'}
            refresh={this.props.getData}
            actions={[{action: this.props.deleteOrchestrator, icon: 'icon-trash'}]}
        />
    </section>
    )}
}

export default ImprinterOrchestrator
