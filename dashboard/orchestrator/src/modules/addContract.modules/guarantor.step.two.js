import React from 'react'
import {Link} from 'react-router'

const StepThree = (props) => {
  let representatives = props.contract.representatives.map(function (representative, i) {
    return (
      <div key={i} className='list_item'>
        <span>{representative.label}</span>
      </div>
    )
  })
  let recipe = props.contract.recipe.map(function (props, i) {
    if (props.checked === true) {
      return (
        <div key={i} className='list_item'>
          <span>{props.name}</span>
        </div>
      )
    }
  })
  return (
    <div className='step3_review'>
      <div id="secondary_header">
        <div className="header_breadcrumb">
            <h3 className="breadcrumb_title"><Link to={'/context/' + props.name}>{props.name}</Link> / <Link to={'/context/' + props.name + '/new'}>New</Link> / Guarantor</h3>
        </div>
        <nav className="header_menu">
          <h4 className='menu_title'>Review & Send</h4>
        </nav>
      </div>
      <div className='medium-8 columns'>
        <div className='review_graph'>
          <h2 className='review_title'>review</h2>
          <p className='review_description'>
            You are autorizing the device {props.contract.user.name} to be guaranteed from the device {props.contract.provider.name}
          </p>
          <div className='graph'>
            <div className='row'>
              <div className='medium-6 columns'>
                <div className='graph_node graph_user'>
                  <span>{props.contract.user.name}</span>
                </div>
              </div>
              <div className='medium-6 columns'>
                <div className='graph_node graph_machine'>
                  <span>{props.contract.provider.name}</span>
                  <div className='machine_list'>
                    {recipe}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => props.createTransaction()}>Firma il contratto</button>
        </div>
      </div>
      <div className='medium-4 columns'>
        <div className='review_legend'>
          <h2 className='review_title'>legend</h2>
          <div className='legend_web'>
            <div className='review_item user'>
              <div className='item'></div>
              <span>User</span>
              <p>La machine che performa l’accesso</p>
            </div>
            <div className='review_item provider'>
              <div className='item'></div>
              <span>Provider</span>
              <p>La machine che offre l’accesso</p>
            </div>
            <div className='review_item contract'>
              <div className='item'></div>
              <span>Contract</span>
              <p>Il contratto che viene autorizzato con i parametri scelti</p>
            </div>
            <div className='review_item commitment'>
              <div className='item'></div>
              <span>Commitment method</span>
              <p>Il metodo per autentificare l’accesso da parte della machine user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default StepThree
