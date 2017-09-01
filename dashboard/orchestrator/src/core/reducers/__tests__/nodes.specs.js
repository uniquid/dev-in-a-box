  import {
    imprintedNodes,
    nodes,
    selectedNodes,
    toggledControlled
  } from '../nodes'

  describe('Imprinted Nodes Reducer', () => {
    function stateBefore () {
      return []
    }
    
    it('Should get imprinted nodes', () => {
      const action = {
        type: 'GET_IMPRINTED_NODES',
        payload: [
          {
            name: 'item1',
            xpub: '123'
          },
          {
            name: 'item2',
            xpub: '123'
          }
        ]
      }
      const actual = imprintedNodes(stateBefore(), action)
      const expected = [
        {
          name: 'item1',
          xpub: '123',
          confirmations: 0
        },
        {
          name: 'item2',
          xpub: '123',
          confirmations: 0
        }
      ]
      expect(actual).toEqual(expected)
    })
    
    it('Should update confirmation on imprinted nodes', () => {
      const getImprintedNodes = {
        type: 'GET_IMPRINTED_NODES',
        payload: [
          {
            name: 'item1',
            xpub: '123'
          },
          {
            name: 'item2',
            xpub: '123'
          }
        ]
      }
      const updateConfirmations = {
        type: 'UPDATE_CONFIRMATIONS',
        payload: {
          id: 0,
          confirmations: 3
        }
      }
      const temp = imprintedNodes(stateBefore(), getImprintedNodes)
      const actual = imprintedNodes(temp, updateConfirmations)
      const expected = [
        {
          name: 'item1',
          xpub: '123',
          confirmations: 3
        },
        {
          name: 'item2',
          xpub: '123',
          confirmations: 0
        }
      ]
      expect(actual).toEqual(expected)
    })
  })

  describe('Nodes Reducer', () => {
    function stateBefore () {
      return []
    }
    it('Should display nodes', () => {
      const action = {
        type: 'GET_NODES',
        payload: [
          {
            name: 'item1',
            xpub: '123'
          },
          {
            name: 'item2',
            xpub: '123'
          }
        ]
      }
      const actual = nodes(stateBefore(), action)
      const expected = [
      {
        name: 'item1',
        xpub: '123'
      },
      {
        name: 'item2',
        xpub: '123'
      }
      ]
      expect(actual).toEqual(expected)
    })
    
    describe('Selected Nodes Reducer', () => {
      function stateBefore () {
        return []
      }
      it('Should select a node', () => {
        const action = {
          type: 'SELECT_NODE',
          payload: '123'
        }
        const actual = selectedNodes(stateBefore(), action)
        const expected = ['123']
        expect(actual).toEqual(expected)
      })
      it('Should reset selection', () => {
        const action = {
          type: 'RESET_SELECTION'
        }
        const actual = selectedNodes(stateBefore(), action)
        const expected = []
        expect(actual).toEqual(expected)
      })
      it('Should select all nodes', () => {
        const action = {
          type: 'SELECT_ALL',
          payload: [
            {
              xpub: '123',
              name: 'item1'
            },
            {
              xpub: '456',
              name: 'item2'
            },
            {
              xpub: '789',
              name: 'item3'
            },
            {
              xpub: '000',
              name: 'item4'
            }
          ]
        }
        const actual = selectedNodes(stateBefore(), action)
        const expected = ['123', '456', '789', '000']
        expect(actual).toEqual(expected)
      })
    })
    
    describe('Toggled Controller Reducer', () => {
      function stateBefore () {
        return false
      }
      it('Should toggle the controller checkbox', () => {
        const action = {
          type: 'TOGGLE_CONTROLLER',
          payload: true
        }
        const actual = toggledControlled(stateBefore(), action)
        const expected = true
        expect(actual).toEqual(expected)
      })
    })
  })
