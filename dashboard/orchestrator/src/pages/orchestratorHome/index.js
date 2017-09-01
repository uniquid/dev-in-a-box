import * as React from 'react'
import { browserHistory } from 'react-router'

class OrchestratorHome extends React.Component {
  componentWillMount () {
    browserHistory.replace('/o/context/asset')
  }
  render () {
    return (
      <div className='home'>
        <section className='home_container'>
          <div className='container_context'>
            <div className='context_new'>
            <h4>Homepage</h4>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default OrchestratorHome
