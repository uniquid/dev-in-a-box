import 'rxjs'
import {Observable} from 'rxjs'
import {config} from '../../config'
import axios from 'axios'

const registryPostEpic = action$ =>
action$.ofType('ADD_REGISTRY')
.concatMap(action => {
  return Observable
  .fromPromise(axios.post(config.registryURL, action.payload))
  .mapTo({
    type: 'ADD_CONTRACT_SUCCESS',
    payload: {
      status: true,
      title: 'Hooray',
      message: 'The contract has been published successfully',
      code: 0,
      icon: 'icon-folder'
    }
  })
  .catch(err => Observable.of({
    type: 'HAS_ERROR',
    payload: {
      status: true,
      title: 'Error',
      message: 'Il Contratto è stato deployato sulla blockchain ma non è stato correttamente inserito nel registro.',
      code: 1,
      icon: 'icon-error'
    }
  }))
})

export default registryPostEpic
