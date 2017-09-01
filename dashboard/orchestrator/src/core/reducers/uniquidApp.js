import { combineReducers } from 'redux'
import {nodes, imprintedNodes, nodesFromImprinter} from './nodes.js'
import {contracts, newContracts} from './contracts.js'
import {connection, tail} from './connection'
import {contexts} from './contexts'
import {feedback} from './feedback'
import {user} from './user'
import {contractCreator} from './contractCreator'
import {repeat} from './repeat'
import {registry} from './registry'
import {orchestrators} from './orchestrators'
import {imprinter} from './imprinter'
import {status} from './status'

const uniquidApp = combineReducers({
  user,
  contractCreator,
  connection,
  newContracts,
  tail,
  feedback,
  contexts,
  nodes,
  imprintedNodes,
  contracts,
  repeat,
  nodesFromImprinter,
  registry,
  orchestrators,
  imprinter,
  status
})

export default uniquidApp
