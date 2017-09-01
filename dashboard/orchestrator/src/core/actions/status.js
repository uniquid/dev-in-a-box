export const UPDATE_STATUS = 'UPDATE_STATUS'
export const RESET_STATUS = 'RESET_STATUS'

export const updateStatusAction = (message, status) => {
  return {
    type: 'UPDATE_STATUS',
    payload: {
      status,
      message
    }
  }
}

export const resetStatusAction = (status) => {
  return {
    type: 'RESET_STATUS',
    status
  }
}