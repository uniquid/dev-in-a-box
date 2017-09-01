import * as types from '../nodes.js'
import * as actions from '../nodes.js'

describe('Nodes actions', () => {
  it('Should display nodes', () => {
    const nodes = []
    const expectedAction = {
      type: types.GET_NODES,
      payload: nodes
    }
    expect(actions.getNodesAction(nodes)).toEqual(expectedAction)
  })
  it('Should display imprinted nodes', () => {
    const nodes = []
    const expectedAction = {
      type: types.GET_IMPRINTED_NODES,
      payload: nodes
    }
    expect(actions.getImprintedNodesAction(nodes)).toEqual(expectedAction)
  })

  it('Should display updated confirmation on nodes', () => {
    const id = 0
    const confirmations = 9
    const nodeConfirmation = {
      id,
      confirmations
    }
    const expectedAction = {
      type: types.UPDATE_CONFIRMATIONS,
      payload: nodeConfirmation
    }
    expect(actions.updateConfirmationsAction(id, confirmations)).toEqual(expectedAction)
  })

  it('Should toggle the controller from filter bar', () => {
    const status = true
    const expectedAction = {
      type: types.TOGGLE_CONTROLLER,
      payload: status
    }
    expect(actions.toggledControllerAction(status)).toEqual(expectedAction)
  })

  it('Should evidence the selected nodes', () => {
    const node = {}
    const expectedAction = {
      type: types.SELECT_NODE,
      payload: node
    }
    expect(actions.selectNodesAction(node)).toEqual(expectedAction)
  })

  it('Should reset the nodes selection', () => {
    const expectedAction = {
      type: types.RESET_SELECTION
    }
    expect(actions.resetSelectedNodesAction()).toEqual(expectedAction)
  })

  it('Should select all nodes', () => {
    const nodes = []
    const expectedAction = {
      type: types.SELECT_ALL,
      payload: nodes
    }
    expect(actions.selectAllAction(nodes)).toEqual(expectedAction)
  })

})

