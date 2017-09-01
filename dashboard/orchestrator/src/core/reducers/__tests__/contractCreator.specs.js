import {contractCreator} from '../contractCreator'

describe('Contract Creator Reducer', () => {
  function stateBefore () {
    return  {
     provider: {
       name: '',
       xpub: '',
       recipe: []
     },
     user: {
       name: '',
       xpub: ''
     },
     orchestrator: {
       name: '',
       xpub: ''
     },
     recipe: {
       version: null,
       content: []
     },
     representatives: [],
     revocation: {
       value: '',
       label: ''
     }
    }
  }

  it('Should add the provider', () => {
    const action = {
      type: 'ADD_PROVIDER',
      provider: {
        name: 'jim morrison',
        xpub: 123
      }
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: 'jim morrison',
        xpub: 123,
        recipe: []
      },
      user: {
        name: '',
        xpub: ''
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: null,
        content: []
      },
      representatives: [],
      revocation: {
        value: '',
        label: ''
      }
     }
    expect(actual).toEqual(expected)
  })

  it('Should add the user', () => {
    const action = {
      type: 'ADD_USER',
      user: {
        name: 'jimy hendrix',
        xpub: 123
      }
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: '',
        xpub: '',
        recipe: []
      },
      user: {
        name: 'jimy hendrix',
        xpub: 123
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: null,
        content: []
      },
      representatives: [],
      revocation: {
        value: '',
        label: ''
      }
     }
    expect(actual).toEqual(expected)
  })

  it('Should add the version', () => {
    const action = {
      type: 'ADD_VERSION',
      version: 0
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: '',
        xpub: '',
        recipe: []
      },
      user: {
        name: '',
        xpub: ''
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: 0,
        content: []
      },
      representatives: [],
      revocation: {
        value: '',
        label: ''
      }
     }
    expect(actual).toEqual(expected)
  })

  it('Should add the revokation', () => {
    const action = {
      type: 'ADD_REVOCATION',
      revokation: {
        value: '123',
        label: 'frank zappa'
      }
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: '',
        xpub: '',
        recipe: []
      },
      user: {
        name: '',
        xpub: ''
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: null,
        content: []
      },
      representatives: [],
      revocation: {
        value: '123',
        label: 'frank zappa'
      }
     }
    expect(actual).toEqual(expected)
  })

  it('Should add the recipe', () => {
    const action = {
      type: 'ADD_RECIPE',
      recipe: {
        name: 'access',
        checked: [30, 31, 33, 35]
      }
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: '',
        xpub: '',
        recipe: []
      },
      user: {
        name: '',
        xpub: ''
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: null,
        content: [
          {
            checked: [30, 31, 33, 35],
            name: 'access'
          }
        ]
      },
      representatives: [],
      revocation: {
        value: '',
        label: ''
      }
     }
    expect(actual).toEqual(expected)
  })

  it('Should update the recipe', () => {
    const action = {
      type: 'UPDATE_RECIPE',
      recipe: {
        name: '40',
        checked: true
      }
    }
    const actual = contractCreator(stateBefore(), action)
    const expected = {
      provider: {
        name: '',
        xpub: '',
        recipe: []
      },
      user: {
        name: '',
        xpub: ''
      },
      orchestrator: {
        name: '',
        xpub: ''
      },
      recipe: {
        version: null,
        content: [
          {
            checked: true,
            name: '40',
            properties: []
          }
        ]
      },
      representatives: [],
      revocation: {
        value: '',
        label: ''
      }
     }
    expect(actual).toEqual(expected)
  })

})
