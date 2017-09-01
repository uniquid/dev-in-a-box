/**
* Registro Comunicazione interfaccia web e orchestratore
**/
import axios from 'axios'

export const loader = axios.get('/conf.json')
  .then(resp => {
    const custom_config = JSON.parse(resp.request.responseText)
    if(custom_config){
      Object.assign(communicationType, custom_config.communicationType)
      Object.assign(contractType, custom_config.contractType)
      Object.assign(uidError, custom_config.uidError)
      Object.assign(config, custom_config.config)
      Object.assign(tabacchi, custom_config.tabacchi)
    }
  }, ()=>{})


export const communicationType = {
  createNewContext: 2,
  getNodes: 4,
  getContexts: 5,
  getContracts: 6,
  getImprintedNodes: 10,
  auth: 32,
  sync: 33,
  sendContract: 120,
  getUserInfo: 121,
  deleteContract: 122
}

export const contractType = {
  orchestration: 'Orchestration',
  revocation: 'Revocation',
  access: 'Access'
}

export const uidError = {
  insufficientBalance: -1
}

export const config = {
  bcAPI: 'http://52.167.211.151:3001/insight-api',
  registryURL: 'http://104.130.230.85:8080/registry',
  imprinterApiUrl: 'http://13.94.140.181:8080/api/v1/',
  tabacchiApiUrl: 'http://52.225.217.168:8000/'
}


export const tabacchi = {
  rechargeAmount: 10
}
