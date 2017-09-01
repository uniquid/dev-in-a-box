import { combineEpics } from 'redux-observable'
import receiveMsgEpic from './receiveMsgEpic'
import ContractEpic from './contractEpic'
import registryPostEpic from './registryPostEpic'

export const rootEpic = combineEpics(
  receiveMsgEpic,
  ContractEpic,
  registryPostEpic
)
