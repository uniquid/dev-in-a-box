export const HAS_ERROR = 'HAS_ERROR'
export const ADD_CONTRACT_SUCCESS = 'ADD_CONTRACT_SUCCESS'

export const hasErrorAction = (status, message, code, title, icon) => {
  let error = {
    status,
    message,
    code,
    title,
    icon
  }
  return {
    type: 'HAS_ERROR',
    payload: error
  }
}
