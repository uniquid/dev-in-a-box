import { createStore, applyMiddleware, compose } from 'redux'
import uniquidApp from '../reducers/uniquidApp'
import createLogger from 'redux-logger'

import { createEpicMiddleware } from 'redux-observable'
import { rootEpic } from '../epics/rootEpic'

const epicMiddleware = createEpicMiddleware(rootEpic)

const logger = createLogger()

const configureStore = () => {
  const store = createStore(
    uniquidApp,
    compose(applyMiddleware(epicMiddleware, logger))
  )

  return store
}

export default configureStore
