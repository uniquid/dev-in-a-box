'use strict'

const tabacchi = require('fastify')()
const exec = require('child-process-promise').exec
var base_cmd = `bitcoin-cli --rpcuser=usr --rpcpassword=pwd --rpcconnect=172.18.0.10 -rpcport=18332 -regtest`

var lifecycle = {
    currentlyMining: 0,
    history: [],
    mtm: {
        timer: {},
        date: new Date
    }
}

tabacchi.use(require('cors')())

tabacchi.get('/history', (request, reply) => {
    reply.send({history: lifecycle.history})
})

tabacchi.get('/nextblock', (request, reply) => {
    if (!lifecycle.mtm || !lifecycle.currentlyMining) {
        return reply.send({status: 1, timeout: 0})
    }

    reply.send({
        status: 0,
        timeout: ((lifecycle.mtm.timer._idleTimeout - (Date.now()-lifecycle.mtm.date))/1000)
    })
})

tabacchi.post('/topup', (request, reply) => {
    let recharge = {
        address: request.body.address || "",
        amount: request.body.amount || 0
    }

    exec(`${base_cmd} sendtoaddress ${recharge.address} ${recharge.amount}`).then((result) => {
        lifecycle.history.push(recharge)
        reply.send({status: 1, topup: recharge})
    }).catch((err) => {
        console.error(`ERROR: ${err}`);
        reply.code(500).send({status: 0, topup: recharge})
    })
})

tabacchi.get('/mine', (request, reply) => {
    if (!request.query.times || !request.query.interval) {
        return reply.code(417).send({status: 1, message: 'Wrong parameters'})
    }

    if (lifecycle.currentlyMining > 0) {
        return reply
            .code(500)
            .send({status: 1, message: 'Tabacchi is already mining'})
    }

    lifecycle.currentlyMining++
    reply.code(200).send({status: 0, message: 'Mining right now'})
    lifecycle.mtm.timer = setInterval(() => {
        exec(`${base_cmd} generate 1`).then((result) => {
            lifecycle.currentlyMining += 1
            lifecycle.mtm.date = Date.now()
            console.log(currentlyMining)

            if (lifecycle.currentlyMining > request.query.times) {
                lifecycle.currentlyMining = 0
                clearInterval(lifecycle.mtm.timer)
            }
        })
    }, request.query.interval * 1000)

    lifecycle.mtm.date = Date.now()
})
tabacchi.get('/mineshot',(request,reply) =>{
    exec(`${base_cmd} generate 1`).then((result) => {
        reply.code(200).send({status: 0, message: 'Mine OK'})
    }).catch((err)=>{
        reply.code(517).send({status: 0, message: 'Not Mined'})
    })
})
tabacchi.listen(8000, (err) => {
    if (err) { throw err }
    console.log(`Tabacchi listening on ${tabacchi.server.address().port}`)
})
