import React from 'react'

const ContextForm = (props) => {

  return (
    <div className="page page-new-context">
      <div className="row">
        <h2 className="context_title">Yo! Let's create a new context <span>👏</span></h2>
        <p className="context_tagline">This module implements several popular techniques for visualizing hierarchical data</p>
        <div className="context_creation">
          <div className="row context_form">
            <div className="large-6 columns">
              <div className="form_description">
                <h4 className="description_title">Typology</h4>
                <p className="description_tagline">What kind of typology is the context?</p>
              </div>
            </div>
            <div className="large-6 columns">
              <div className="form_definition typology">
                <input type="radio" name="type" id="physical" value="physical" /> <label htmlFor="physical">Physical</label>
                <input type="radio" name="type" id="virtual" value="virtual" /> <label htmlFor="virtual">Virtual</label>
              </div>
            </div>
          </div>
          <div className="row context_form">
            <div className="large-6 columns">
              <div className="form_description">
                <h4 className="description_title">Name</h4>
                <p className="description_tagline">Decide the name of the context, you can edit it in future</p>
              </div>
            </div>
            <div className="large-6 columns">
              <div className="form_definition name">
                <input id="context_name" type="text" value={props.name} onChange={props.setName}/>
              </div>
            </div>
          </div>
          {/*<div className="row context_form">
            <div className="large-6 columns">
              <div className="form_description">
                <h4 className="description_title">Parent context</h4>
                <p className="description_tagline">What kind of typology is the context?</p>
              </div>
            </div>
            <div className="large-6 columns">
              <div className="form_definition">
                <select disabled id="context_parent"> <option>None</option><option>Carlo Lentini</option></select>
              </div>
            </div>
          </div>
          <div className="row context_form">
            <div className="large-6 columns">
              <div className="form_description">
                <h4 className="description_title">Supervisor</h4>
                <p className="description_tagline">What kind of typology is the context?</p>
              </div>
            </div>
            <div className="large-6 columns">
              <div className="form_definition parent">
                <select disabled id="context_parent"> <option>None</option><option>Carlo Lentini</option></select>
              </div>
            </div>
          </div>
          <div className="row context_form">
            <div className="large-6 columns">
              <div className="form_description">
                <h4 className="description_title">Owner</h4>
                <p className="description_tagline">What kind of typology is the context?</p>
              </div>
            </div>
            <div className="large-6 columns">
              <div className="form_definition">
                <select disabled id="context_parent"> <option>None</option><option>Carlo Lentini</option></select>
              </div>
            </div>
          </div>*/}
          <div className="context_buttons">
            <button className="button good" onClick={props.addContext}>Create</button>
            <button className="button delete">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextForm;
