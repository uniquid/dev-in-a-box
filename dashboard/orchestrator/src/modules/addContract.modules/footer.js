import React from 'react'

const Footer = (props) => {
  let backButton;
  let nextButton;

  if(props.stepBack === '') {
    backButton = <button className="button_delete"  onClick={()=>{props.viewTab(props.stepBack)}}>Cancel</button>
  } else {
    backButton = <button className="button_delete"  onClick={()=>{props.viewTab(props.stepBack)}}>Back</button>
  }

  if(props.stepNext === '') {
  nextButton = <button className="button_next good" onClick={()=>{props.deployContract()}}>Deploy</button>
  }
  else {
    nextButton = <button className="button_next good" onClick={()=>{props.viewTab(props.stepNext)}}>Next</button>
  }

  return (
    <div className="breadcrumb_footer">
      {nextButton}
      {backButton}
    </div>
  )
}

export default Footer
