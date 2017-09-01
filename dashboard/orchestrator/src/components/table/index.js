import * as React from 'react'
import TableComponent from './table'


class Table extends React.Component {
  constructor () {
    super()
    this.state = {
      checked: [],
      selectAll: false
    }
    this.getRowOptions = this.getRowOptions.bind(this)
  }
  componentDidMount(){
    this.radioId = this.props.radio ? Math.random()+1 : null
  }
  getRowOptions = (node) => {
    const opts = this.props.getRowOptions && this.props.getRowOptions(node)
    return Object.assign({
      checked: this.state.checked.includes(node.id),
      selectable:true
    }, opts)
  }
  selectNode = (id) => {
    const newChecked = this.props.radio ? [] : this.state.checked.slice()
    const i = newChecked.indexOf(id)
    let _selectAll = this.state.selectAll;
    if (i === -1) {
      newChecked.push(id)
      if(newChecked.length === this.props.nodes.filter(node => this.getRowOptions(node).selectable).length){
        _selectAll = true
      }
    } else {
      newChecked.splice(i, 1)
      _selectAll = false
    }
    return this.setState({
      ...this.state,
      checked : newChecked,
      selectAll: _selectAll
    })
  }


  /* TOTAL SELECTOR */
  totalSelector (status, nodes) {
    let newChecked = []
    if (status) {
      newChecked = nodes
        .filter(node => this.getRowOptions(node).selectable)
        .map(node => node.id)
    }
    this.setState({
      ...this.state,
      selectAll: status,
      checked: newChecked
    })
  }

  componentDidUpdate (prevProps, prevState) {
    const checkedNodes = this.state.checked.map(node_id => this.props.nodes.find(node => node.id === node_id)).filter(node=>!!node)
    const unselectable_checked = checkedNodes.filter(node => !this.getRowOptions(node).selectable).map(node => node.id)
    if(unselectable_checked.length){
      return this.setState({
        ...this.state,
        checked: this.state.checked.filter(node_id => !unselectable_checked.includes(node_id))
      })
      unselectable_checked.includes(node.id)
    }else if(this.state.checked !== prevState.checked){
      this.props.selectedNodes && this.props.selectedNodes(this.state.checked)
    }
  }

  render () {
    return (
      <TableComponent
        noSelect={this.props.noSelect}
        getRowOptions={this.getRowOptions}
        classe={this.props.classe}
        values={this.props.values}
        toggledControlled={this.state.selectAll}
        totalSelector={this.totalSelector.bind(this)}
        selectedNodes={this.state.checked}
        headActions={this.props.headActions}
        nodes={this.props.nodes}
        selectNodes={this.selectNode.bind(this)}
        body={this.props.body}
        actions={this.props.actions}
        status={this.props.status}
        refresh={this.props.refresh}
        radioId={this.radioId}
      />
    )
  }
}

export default Table
