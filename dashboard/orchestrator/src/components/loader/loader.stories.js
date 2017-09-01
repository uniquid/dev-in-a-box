import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Loader from './loader'

storiesOf('Loader', module)
.add('Loader 0%', () => {
    return (
      <Loader
        status={false}
        percent={0}
        message={'This is a loader message at 0%'}
      />
    )
   })
   .add('Loader 20%', () => {
    return (
      <Loader
        status={false}
        percent={20}
        message={'This is a loader message at 20%'}
      />
    )
   })
   .add('Loader 50%', () => {
    return (
      <Loader
        status={false}
        percent={50}
        message={'This is a loader message at 50%'}
      />
    )
   })
   .add('Loader 80%', () => {
    return (
      <Loader
        status={false}
        percent={80}
        message={'This is a loader message at 80%'}
      />
    )
   })
   .add('Loader 100%', () => {
    return (
      <Loader
        status={false}
        percent={100}
        message={'This is a loader message at 100%'}
      />
    )
   })
    .add('Loader inactive', () => {
    return (
      <Loader
        status={true}
        percent={0}
        message={''}
      />
    )
   })
