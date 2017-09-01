import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Sidebar from './sidebar'

storiesOf('Sidebar', module)
  .add('Orchestrator', () => {
    const lists = [{name: 'ciccio', xpub: '123'}, {name:'pasticcio', xpub: '456'}]
    return (
      <Sidebar
        palette={'ocean'}
        contexts={lists}
      />
    )
   })
   .add('Imprinter', () => {
     const lists = [{name: 'ciccio', xpub: '123'}, {name:'pasticcio', xpub: '456'}]
     return (
       <Sidebar
         palette='orange'
         contexts={lists}
         logo='uniquid_white'
         name='imprinter'
      />
     )
   })
