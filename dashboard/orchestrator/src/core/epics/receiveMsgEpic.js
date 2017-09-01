import 'rxjs'
import {Observable} from 'rxjs'

const receiveMsgEpic = action$ =>
  action$.ofType('RECEIVE_MESSAGE')
  .flatMap(action => {
    if (action.msg.body.error === -1) {
      let percent = action.msg.body.result.substr(0, action.msg.body.result.length - 1)
      return Observable.concat(
        Observable.of({
          type: 'IS_SYNCED',
          payload: {
            action: action,
            status: false,
            percent: percent,
            message: 'Hold on! Blockchain is syncing...'
          }
        }),
        Observable.of({
          type: 'ADD_REPEAT',
          payload: action.req
        })
      )
    } else {
      console.log('ti arriva solo l utente')
      console.log(action)
      let obj = JSON.parse(action.msg.body.result)
      return Observable.of({
        type: action.req,
        payload: obj
      })
    }
  })

export default receiveMsgEpic
