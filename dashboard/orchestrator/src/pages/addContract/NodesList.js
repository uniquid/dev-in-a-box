import React from 'react'
import SearchBar from './searchBar'
import ListItem from './listItem'
import PropTypes from 'prop-types'

const NodesList = ({filtered, handleChange, filterText, nodes, data, selectNode, type, input, toggledControlled, totalSelector, selectedNodes}) => (
  <section className='newContract_selection'>
    <form className='form_definition selection_list'>
      <SearchBar
        handleChange={handleChange}
        placeholder={'Type the name of the node'}
        value={filterText}
        type={type}
        totalSelector={totalSelector}
        toggledControlled={toggledControlled}
        data={data}
        filtered={filtered}
      />
      {nodes.map((machine, i) => (
        <ListItem
          machine={machine}
          filterText={filterText}
          selectNode={selectNode}
          type={type}
          key={i}
          input={input}
          checked={selectedNodes ? selectedNodes.filter(sel => sel === machine.id)[0] : 'null'}
        />
      )) || 'loading...'}
    </form>
  </section>
  )

NodesList.propTypes = {
  handleChange: PropTypes.func,
  filterText: PropTypes.string,
  nodes: PropTypes.array,
  selectNode: PropTypes.func,
  type: PropTypes.string
}

export default NodesList
