import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Header from './header'

storiesOf('Header', module)
  .add('full', () => {
    return (
      <Header
        user={'Bernini'}
        connectionStatus={'Connected'}
        name={'Homepage'}
        size={'full'}
      />
    )
   })
   .add('with sidebar', () => {
    return (
      <Header
        user={'Bernini'}
        connectionStatus={'Connected'}
        name={'Homepage'}
      />
    )
   })
