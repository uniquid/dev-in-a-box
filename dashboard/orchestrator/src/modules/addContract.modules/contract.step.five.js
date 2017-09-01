import React from 'react'
import {Link} from 'react-router'

const StepFive = (props) => {
  let annulment = []
  if (props.valueRevocation.label.length > 0) {
    annulment.push(
      <div key={props.valueRevocation.label} className='graph_node graph_annulment'>
        <div className='annulment_list'>
          <div className='list_item'>
            <span>{props.valueRevocation.label}</span>
          </div>
        </div>
      </div>
    )
  }

  let representatives = props.contract.representatives.map(function (representative, i) {
    return (
      <div key={i} className='list_item'>
        <span>{representative.label}</span>
      </div>
    )
  })
  let recipe = props.contract.recipe.content.map(function (props, i) {
    if (props.checked === true) {
      return (
        <div key={i} className='list_item'>
          <span>{props.label ? props.label : props.value }</span>
        </div>
      )
    }
  })
  return (
    <div className='step3_review'>
      <div id='secondary_header'>
        <div className='header_breadcrumb'>
          <h3 className='breadcrumb_title'>
            <Link to={'/context/' + props.name}>{props.name}</Link> / <Link to={'/context/' + props.name + '/new-contract'}>New Contract</Link>
          </h3>
        </div>
        <nav className='header_menu'>
          <h4 className='menu_title'>Review & Send</h4>
        </nav>
      </div>
      <div className='medium-8 columns'>
        <div className='review_graph'>
          <h2 className='review_title'>review</h2>
          <p className='review_description'>
            You are autorizing the device {props.contract.user.name} to perform the access contract to the device {props.contract.provider.name}
          </p>
          <div className='graph'>
            <div className='row collapse'>
              <div className='medium-4 columns'>
                <div className='graph_node graph_user'>
                  <span>{props.contract.user.name}</span>
                </div>
              </div>
              <div className='medium-4 columns'>
                {annulment}
                <div className='graph_node graph_commitment'>
                  <div className={representatives.length === 0 ? 'commitment_list wo_representatives' : 'commitment_list'}>
                    {representatives}
                  </div>
                </div>
              </div>
              <div className='medium-4 columns'>
                <div className='graph_node graph_machine'>
                  <span>{props.contract.provider.name}</span>
                  <div className='machine_list'>
                    {recipe}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => props.createTransaction()}>Sign Contract</button>
        </div>
      </div>
      <div className='medium-4 columns'>
        <div className='review_legend'>
          <h2 className='review_title'>legend</h2>
          <div className='legend_web'>
            <div className='review_item user'>
              <div className='item'></div>
              <span>User</span>
              <p>The machine who uses the contract</p>
            </div>
            <div className='review_item provider'>
              <div className='item'></div>
              <span>Provider</span>
              <p>The machine who offers the access</p>
            </div>
            <div className='review_item commitment'>
              <div className='icon-cross'></div>
              <span>Revocation</span>
              <p>The machine that can revoke the permission to perform the contract</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default StepFive
