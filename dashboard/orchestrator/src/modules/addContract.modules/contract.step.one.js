import React from 'react'

const StepOne = (props) => {
  let rows = []
  if (props.nodes !== undefined) {
    props.nodes.map(function (machine) {
      if (machine.name.indexOf(props.filterText) === -1) {
        return ''
      } else {
        // if nodes has orchestration contract unconfirmed not push into list
        rows.push(
          <div key={'provider' + machine.xpub} className='list_item provider'>
            <input onClick={props.selectProvider} value={machine.xpub} id={machine.xpub} name='provider' type='checkbox' className='checkbox item_checkbox'/>
            <label htmlFor={machine.xpub}>{machine.name}</label>
          </div>
        )
      }
    })
  }
  return (
    <div>
      <div className='row'>
        <div className='medium-8 medium-offset-2 columns'>
          <div className='newContract_explanation'>
            <div className='explanaton_user'>
              <span className='user_tot'>0</span>
              <h5>User</h5>
            </div>
            <div className='explanaton_link' />
            <div className='explanaton_provider'>
              <span className='user_tot'>0</span>
              <h5>Provider</h5>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='medium-4 medium-offset-2 columns'>
          <section className='newContract_selection'>
            <form className='form_definition selection_list'>
              <div className='form_container'>
                <input onChange={props.handleChange} className='selection_search' placeholder='search the node...' value={props.filterText} />
                <span className='icon-magnifying-glass' />
              </div>
              {rows}
            </form>
          </section>
        </div>
        <div className='medium-4 end columns'>
          <section className='newContract_selection'>
            <form className='form_definition selection_list'>
              <div className='form_container'>
                <input onChange={props.handleChange} className='selection_search' placeholder='search the node...' value={props.filterText} />
                <span className='icon-magnifying-glass' />
              </div>
              {rows}
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

export default StepOne
