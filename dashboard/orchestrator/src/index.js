// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import configureStore from './core/store/configureStore'
import 'rxjs'
import './styles/app.scss'
import {loader as config_loader} from './config'

import Root from './core/store/root'

config_loader.then(() => {
  const store = configureStore()

  ReactDOM.render(
    <Root store={store} />,
    document.getElementById('root')
  )
},(err)=>{
  document.body.innerHTML=`<h1 style="color:black">Configuration error: ${err.message}</h1>`
})
