import React from 'react'
import Filter from '../../components/filter/filter'
import Table from '../../components/table'

class Nodes extends React.Component {

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
      <div className='page page_nodes'>
        <Filter
          filtered={this.setFiltered.bind(this)}
          data={this.props.nodes || []}
          filters={['name']}/>
          // filters={['name','status']}/>
        />
        <Table
          nodes={this.state.filteredNodes.map(node => {
            return {
              name: node.name,
              tag: node.tag,
              recipe: node.recipe,
              timestamp: node.timestamp,
              id: node.xpub
            }
          })}
          noSelect={true}
          refresh={this.props.getData}
          values={['name', 'tag', 'recipe', 'date']}
          body={'imprintedNodes'}
          classe={'nodes'}
        />
      </div>
    )
  }
}

export default Nodes
