export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE'


export const receiveMessageAction = (msg, req) => {
  return {
    type: 'RECEIVE_MESSAGE',
    msg,
    req
  }
}
