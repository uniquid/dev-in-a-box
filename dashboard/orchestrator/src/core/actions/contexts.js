export const GET_CONTEXTS = 'GET_CONTEXTS'

export const getContextsAction = (data) => {
  return {
    type: 'GET_CONTEXTS',
    payload: data
  }
}
