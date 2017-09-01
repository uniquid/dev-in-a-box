import React from 'react'
import moment from 'moment'

const Row = (props) => {
  let cells = []
  let actions = []
  Object.keys(props.infos).forEach(function (key, index) {
    if (key === 'id') {
      return ''
    }
    if (key === 'timestamp') {
      return cells.push(
        <div key={index} className={'row_item flex-item ' + key}>
          <div className='item_container'>
            { moment(props.infos[key]).format('D MMM, YYYY @ HH:mm:ss') }
          </div>
        </div>
      )
    } else {
      return cells.push(
        <div key={index} className={'row_item flex-item ' + key}>
          <div className='item_container'>{props.infos[key]}</div>
        </div>
        )
    }
  })
  if (props.actions !== undefined) {
    props.actions.map(function (action, i) {
      actions.push(
        <div key={i} className='row_item flex-item icon'>
            <div className='item_container'>
              <div className='icon_container'>
                  <div className='container node_actions'>
                      <span onClick={() => action.action(props.infos.xpub)} className={action.icon} />
                    </div>
                </div>
            </div>
          </div>
        )
    })
  }
  const rnd = Math.random()
  return (
    <div className='table_row'>
      <div className='table_row-container'>
        <div className='table_row-single flex-row'>
        {props.noSelect ||
            <div className='row_item flex-item select'>
              <div className='item_container'>
                <div className={`${props.radioId ? 'radio' : 'checkbox'} clearfix ${props.infos.status}`}>
                  <input checked={props.rowOptions.checked} disabled={!props.rowOptions.selectable} name={props.radioId} type={`${props.radioId ? 'radio' : 'checkbox'}`} id={rnd} onChange={() => { props.selectNodes(props.infos.id) }} />
                  <label htmlFor={rnd} />
                </div>
              </div>
            </div>
          }
          {cells}
          {actions}
        </div>
      </div>
    </div>
  )
}

export default Row
