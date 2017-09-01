import axios from 'axios'
import {config} from '../config'
import {retry} from './util'
let url = () => config.imprinterApiUrl

function getImprinterWorker (endpoint, params) {
  return retry(()=>axios.get(url() + endpoint,{timeout:3000}), 3, 3000)
}

function postImprinterWorker (endpoint, params) {
  return axios.post(url() + endpoint, params)
}

function deleteImprinterWorker (endpoint, params) {
  return axios.delete(url() + endpoint, params)
}

const ImprinterWorker = {
  get: getImprinterWorker,
  post: postImprinterWorker,
  delete: deleteImprinterWorker
}

export default ImprinterWorker
