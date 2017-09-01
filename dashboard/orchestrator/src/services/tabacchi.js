import axios from 'axios'
import {config} from '../config'

function getTabacchiWorker (endpoint) {
    return new Promise (function (resolve, reject) {
      axios.get(config.tabacchiApiUrl + endpoint)
      .then (function (res) {
          resolve(res)
      })
      .catch (function (err) {
          reject(err)
      })
    })
}

function postTabacchiWorker (endpoint, params) {
	return new Promise (function (resolve, reject) {
		axios.post(config.tabacchiApiUrl + endpoint, params)
		.then(function (res) {
			resolve(res)
		})
		.catch(function(err) {
			reject(err)
		})
	})
}

const TabacchiWorker = {
  get: getTabacchiWorker,
  post: postTabacchiWorker
}

export default TabacchiWorker
