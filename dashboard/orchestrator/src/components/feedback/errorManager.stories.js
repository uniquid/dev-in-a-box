import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import ErrManager from './errorManager'

storiesOf('Error Manager', module)
  .add('with a custom message', () => {
    return (
      <ErrManager
        status={true}
        message='Custom error message'
      />
    )
   })
   .add('with a false status', () => {
    return (
      <ErrManager
        status={false}
        message='Custom error message'
      />
    )
   })
   