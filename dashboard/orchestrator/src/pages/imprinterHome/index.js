import React from 'react'
import Filter from '../../components/filter/filter'
import Table from '../../components/table'

class Home extends React.Component {
  state = {
    filteredNodes: []
  }

  setFiltered = (nodes) => {
    // console.log(this.state.filteredNodes)
    return this.setState({
      filteredNodes: nodes
    })
  }

  getRowOptions = (node) => {
    return {
      selectable: !['ORCHESTRATED', 'IMPRINTING', 'CREATED', 'ORCHESTRATING'].includes(node.status)
    }
  }

  setSelectedNodeIds (node_ids) {
    const selectedNodes = this.state.filteredNodes.filter(node => node_ids.includes(node.xpub))
    this.setState({
      selectedNodes
    })
  }
  componentDidMount (){
    this.props.getData()
  }
  render () {
    return (
      <section className='machines_list'>
        <Filter
          filtered={this.setFiltered.bind(this)}
          data={this.props.nodes || []}
          filters={['name','status']}/>
        />
        <Table
          nodes={this.state.filteredNodes.map(node => ({
            name: node.name,
            status: node.status,
            retries: node.retries,
            id: node.xpub}))}
          getRowOptions={this.getRowOptions.bind(this)}
          selectedNodes={this.setSelectedNodeIds.bind(this)}
          values={['name', 'status', 'retries']}
          body={'nodes_from_imprinter'}
          classe={'nodes_from_imprinter'}
          refresh={this.props.getData}
          headActions={[
            {action: this.props.manageModal(this.state.selectedNodes), class: 'action_orchestrate', title: 'orchestrate', state: 'orchestrationModal'}
          ]}
        />
      </section>
    )
  }
}

export default Home
