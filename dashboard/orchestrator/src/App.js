/* @flow */

import React, { Component } from 'react'
import {IndexRoute, Router, Route, browserHistory, Link} from 'react-router'
import Home from './pages/home/home'
import Login from './pages/login'
import Context from './pages/context'
import Nodes from './pages/nodes/nodes'
import Contracts from './pages/contracts/contracts'
import NewContract from './pages/addContract/newContract'
import newContext from './pages/createContext/createContext'
import ImprinterHome from './pages/imprinterHome'
import ImprinterOrchestrator from './pages/imprinterOrchestrator'
import OrchestratorHome from './pages/orchestratorHome'
import OrchestratorTemplate from './templates/orchestrator'
import ImprinterTemplate from './templates/imprinter'
import { userIsAuthenticated, userIsNotAuthenticated } from './auth'
import {connect} from 'react-redux'
// const Login = userIsNotAuthenticatedRedir(LoginComponent)
// const Home = userIsAuthenticatedRedir(HomeComponent)
import Toast from './components/toast/toast'
// import {hasErrorAction} from './core/actions/feedback'

class NotFound extends React.Component {
  componentWillMount () {
    browserHistory.replace('/')
  }
  render () {
    return (
      <div className='notFound'>
        <div className='console_background' />
        <span className='notFound_monkey' />
        <h1>Look behind you, a three headed monkey!</h1>
        <Link className='notFound_home' to={'/'}>Back to home</Link>
      </div>

    )
  }
}

const routes = (
  <div>

    <Route path='/login' component={userIsNotAuthenticated(Login)} />
    <Route path='/' component={userIsAuthenticated(Home)} />
    {/* ORCHESTRATOR */}
    <Route path='o' component={userIsAuthenticated(OrchestratorTemplate)} >
      <IndexRoute component={userIsAuthenticated(OrchestratorHome)} />
      <Route component={userIsAuthenticated(Context)}>
        <Route path='context/:name'>
          <IndexRoute component={userIsAuthenticated(Nodes)} />
          <Route path='contracts' component={userIsAuthenticated(Contracts)} />
          <Route path='new-contract' component={userIsAuthenticated(NewContract)} />
        </Route>
      </Route>
      <Route path='/new-context' component={userIsAuthenticated(newContext)} />
    </Route>

    {/* MASSIVE IMPRINTER */}
    <Route path='i' component={userIsAuthenticated(ImprinterTemplate)} >
      <IndexRoute component={userIsAuthenticated(ImprinterHome)} />
      <Route path='orchestrators' component={userIsAuthenticated(ImprinterOrchestrator)} />
    </Route>
    <Route path='*' component={NotFound} />
  </div>
)
class App extends Component {

  closeError () {
    this.props.hasError(false, '', '')
  }
  render () {
    return (
      <div>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    user: state.user,
    connection: state.connection
    // feedback: state.feedback
  })
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     hasError: (status, message, code, title, icon) => {
//       dispatch(hasErrorAction(status, message, code, title, icon))
//     }
//   }
// }

export default connect(mapStateToProps)(App)
