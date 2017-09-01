import 'rxjs'
import {Observable} from 'rxjs'
import axios from 'axios'
import {config} from '../../config'

const ContractEpic = (action$, state$) =>
action$.ofType('SEND_CONTRACT')
.concatMap(action => {
    if (action.payload.code !== 0) {
        return Observable.concat(
        Observable.of({
            type: 'IS_SYNCED',
            payload: {
                status: true,
                percent: 100,
                message: ''
            }
        }),
        Observable.of({
            type: 'HAS_ERROR',
            payload: {
                status: true,
                title: 'Il contratto non è stato pubblicato',
                message: 'La macchina che doveva firmare il contratto non è raggiungibile.',
                code: 1
            }
        })
        )
    } else {
        let store = state$.getState()
        let provider = store.contractCreator.provider.name
        return Observable
        .fromPromise(axios.get(config.bcAPI + '/tx/' + action.payload.message))
        .flatMap(function (response) {
            let providerAddress = response.data.vin[0].addr
            let data = {
                'provider_name': provider,
                'provider_address': providerAddress
            } 
            return Observable.concat(
            Observable.of({
                type: 'IS_SYNCED',
                payload: {
                    status: true,
                    percent: 100,
                    message: ''
                }
            }),
            Observable.of({
                type: 'ADD_REGISTRY',
                payload: data
            })
            )
        })
        .catch(err => Observable.of({
            type: 'HAS_ERROR',
            payload: {
            status: true,
            title: 'GESTIRE L ERRORE',
            message: 'la tx non è stata inserita ancora su insight quindi da 404. fixare con un retry',
            code: 1,
            icon: 'icon-error'
            }
        }))
    }
})
export default ContractEpic
            