import configureStore from '../configureStore'

describe('store', () => {
  it('Should initialize', () => {
    const store = configureStore()
    const actual = store.getState()
    const expected = {
      connection: {
        auth: false,
        status: '',
        synced: {},
        sessionId: '',
        ws: {}
      },
      imprintedNodes: [],
      filter: {
        name: '',
        status: ''
      },
      tail: {
        requests: []
      },
      selectedNodes: [],
      toggledControlled: false,
      contexts: [],
      repeat: [],
      user: {
        name: 'bea_s7',
        ip: '',
        photo: '',
        xpub: ''
      },
      nodes: [],
      contracts: {
        isFetching: '',
        all: []
      },
      error: {
        status: false,
        code: 0,
        message: ''
      },
      contractCreator: {
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
    expect(actual).toEqual(expected)
  })
})
