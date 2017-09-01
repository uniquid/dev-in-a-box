import React from 'react'

const NodesList = (props) => {
  let rows = [];

  let nodes = JSON.parse(localStorage.getItem('entities'));
  let nodesSelection = nodes.map((node) => ( { value: node.name, label: node.name } ) );


  nodesSelection.map(function(node) {
    if(node.label.indexOf(props.filterText) === -1) {
      return "";
    }
    return rows.push(<li className="list_item" key={node.label} onClick={()=>{props.selectNode(node.label)}}>{node.label}</li>)
  })
  return (
    <div className="aside_users">
        <ul className="users_list">
          {rows}
        </ul>
    </div>
  )
}

export default NodesList
