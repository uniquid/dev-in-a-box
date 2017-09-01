export const ADD_REPEAT = 'ADD_REPEAT'
export const DELETE_REPEAT = 'DELETE_REPEAT'

export const addRepeatAction = (repeat) => {
  return {
    type: 'ADD_REPEAT',
    payload: repeat
  }
}

export const deleteRepeatAction = (repeat) => {
  return {
    type: 'DELETE_REPEAT',
    payload: repeat
  }
}
