import React from 'react'

const Breadcrumb = (props) => {
  return (
    <div className="step_breadcrumb">
      <div className="row collapse">
      <span className="breadcrumb_tagline">Create the contract <span className="icon-arrow-right"></span> </span>
        <div className={props.actors_visibility ? "active breadcrumb_step" : "breadcrumb_step"} onClick={()=>{props.viewTab('actors_visibility')}}>1. Choose actors</div>
        <div className={props.recipe_visibility ? "active breadcrumb_step" : "breadcrumb_step"} onClick={()=>{props.viewTab('recipe_visibility')}}>2. Create the recipe</div>
        <div className={props.dates_visibility ? "active breadcrumb_step" : "breadcrumb_step"} onClick={()=>{props.viewTab('dates_visibility')}}>3. Choose dates</div>
      </div>
    </div>
  )
}

export default Breadcrumb
