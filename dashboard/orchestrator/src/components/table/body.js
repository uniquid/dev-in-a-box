import React from 'react'
import Row from './row'

const default_row_options = () => ({
  selectable:true
})
const Body = ({nodes, selectedNodes, selectNodes, actions, filter, getRowOptions, noSelect, radioId}) => {
  return (
    <div>
      {nodes.map((node, i) => {
        const rowOptions = Object.assign(default_row_options(), getRowOptions && getRowOptions(node))
        return (
          <div key={i}>
            <Row
              noSelect={noSelect}
              filter={filter}
              rowOptions={rowOptions}
              timestamp={node.timestamp}
              checked={selectedNodes.filter(sel => sel === node.id)[0]}
              selectNodes={selectNodes}
              infos={node}
              actions={actions}
              radioId={radioId}
          />
          </div>
      )
    })}
    </div>
  )
}

export default Body
