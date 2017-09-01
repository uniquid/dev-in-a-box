import React from 'react'
import Head from './head'
import Body from './body'

const Table = ({
                  classe,
                  values,
                  toggledControlled,
                  totalSelector,
                  selectedNodes,
                  headActions,
                  nodes,
                  selectNodes,
                  body,
                  actions,
                  status,
                  refresh,
                  getRowOptions,
                  noSelect,
                  radioId
                }) => {
  return (
  <div className={classe + ' table row collapse'} >
    <div className='flex_table'>
      <Head
        checkbox='active'
        values={values}
        selectedNodes={selectedNodes}
        actions={headActions}
        toggledControlled={toggledControlled}
        totalSelector={totalSelector}
        nodes={nodes}
        refresh={refresh}
        noSelect={noSelect}
        radioId={radioId}
      />
      <Body
        nodes={nodes}
        getRowOptions={getRowOptions}
        selectedNodes={selectedNodes}
        selectNodes={selectNodes}
        body={body}
        actions={actions}
        status={status}
        noSelect={noSelect}
        radioId={radioId}
      />
    </div>
  </div>
)}

export default Table
