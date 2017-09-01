import math from 'mathjs'
const requests = []

function openConnection (url, addSocket, updateConnectionStatus, username, receiveMessages, hasError, addIp) {
    // Create a socket connection request
    addSocket(new Promise((resolve, reject)=>{
      let socket = new WebSocket('ws://' + url + ':8090')
      socket.onopen = () => {
        // Dispatch the new socket connection to global state
        // Dispatch the new connection status to global state
        resolve(socket)
        updateConnectionStatus(socket.readyState)
      }
      socket.onmessage = (evt) => {
        let msg = JSON.parse(evt.data)
        // Retrieve if the ID of the message is present inside the tails array
        let validRequest = requests.filter(request => request.id === msg.body.id)
        // Check if the sender is the same of authentication
        if (msg.sender !== username) { return hasError(true, 'Il sender è diverso, non è possibile completare l\'azione', 0)}
        if (validRequest.length === 0 || validRequest.length > 1) { return hasError(true, 'ID non presente nella coda', 0)}
        // Send to middleware && remove from tail
        receiveMessages(msg, validRequest[0].name)
        let i = requests.indexOf(validRequest[0])
        requests.splice(i, 1)
      }
      socket.onclose = () => {
        updateConnectionStatus(socket.readyState)
        addIp('')
      }

    }))

  }


  function sendMessages (method, param, type, username, addItemToTail, socket_pr) {
    socket_pr.then(socket => {
      let msg = {
        'sender': username,
        'body': {
          'method': method,
          'params': param,
          'id': math.randomInt(0x7fffffffffffffff)
        }
      }
      let _obj = {
        name: type,
        id: msg.body.id
      }
      requests.push(_obj)
      socket.send(JSON.stringify(msg))
    })
  }

  function closeConnection (socket_pr, updateConnectionStatus, addIp) {
    socket_pr.then(socket => socket.close())
  }

const SocketWorker = {
  open: openConnection,
  send: sendMessages,
  close: closeConnection
}

export default SocketWorker
