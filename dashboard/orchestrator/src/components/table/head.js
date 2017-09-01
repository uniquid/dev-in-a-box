import React from 'react'

const Head = ({values, checkbox, toggledControlled, totalSelector, actions, selectedNodes, refresh, nodes, noSelect, radioId}) => {
  let items = []
  values.map(function (value, i) {
    items.push(
      <div key={i} className={'row_item flex-item ' + value}>
        <div className='item_container'>{value}</div>
      </div>
    )
  })
  const rnd = Math.random()

  return (
    <div className='table_row'>
      <div className='table_row-head flex-row'>
        {noSelect || !!radioId ||
          <div className={'row_item flex-item select ' + checkbox}>
            <div className='item_container'>
              <div className='checkbox clearfix'>
                <input checked={toggledControlled} type='checkbox' id={rnd} onChange={() => { totalSelector(!toggledControlled, nodes) }} />
                <label id={rnd} htmlFor={rnd} />
              </div>
            </div>
          </div>
        }
        {items}
        <div className='table_action'>
          {actions ? actions.map((action, i) => (
            <button key={i} onClick={() => action.action(action.state, true)} className={action.class + ' action_button'} >
              <span>{selectedNodes.length || 0}</span>
              {action.title}
            </button>
          )) : ''}
          {refresh && <button onClick={refresh} className='icon-ccw action_button' title="Refresh"></button>}
        </div>
      </div>
    </div>
  )
}

export default Head
