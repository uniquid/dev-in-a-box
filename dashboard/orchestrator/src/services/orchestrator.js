import axios from 'axios'
import {retry} from './util'
import {config} from '../config'

let url = () => {
  if (config.useOrchestratorServer) {
    return config.orchestratorApiUrl + '/api/v1/'
  } else {
    return 'http://' + sessionStorage.getItem('ip') + ':8080/api/v1/'
  }
}

function getOrchestratorWorker (endpoint, params) {
  return retry(()=>axios.get(url() + endpoint,{timeout:3000}), 3, 3000)
}

function deleteOrchestratorWorker (endpoint, params) {
  return axios({method: 'delete', url: url() + endpoint, data: params})
}

function postOrchestratorWorker (endpoint, params) {
  return axios.post(url() + endpoint, params)
}

const OrchestratorWorker = {
  get: getOrchestratorWorker,
  post: postOrchestratorWorker,
  delete: deleteOrchestratorWorker
}

export default OrchestratorWorker
