const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http, { cors: { origin: '*' } })

    const sharedSession = require('express-socket.io-session')
    gIo.use(sharedSession(session, { autoSave: true }))

    gIo.on('connection', socket => {
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket

        socket.on('disconnect', () => {
            if (socket.handshake) gSocketBySessionIdMap[socket.handshake.sessionID] = null
        })

        socket.on('user endSession', userId => {
            if (userId) gIo.emit('user disconnected', userId)
        })

        socket.on('join board', boardId => {
            if (socket.boardId === boardId) return
            if (socket.boardId) {
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            socket.boardId = boardId
        })

        socket.on('user-watch', userId => {
            socket.join(userId)
            socket.userId = userId
            gIo.emit(socket.userId).emit('New notification', msg)
        })

        socket.on('app activity', activity => {
            if (activity.card.members) {
                activity.card.members.forEach(member => {
                    if (member._id !== activity.byMember._id) gIo.to(member._id).emit('app activity', activity)
                })
            }
        })

        socket.on('board update', savedBoard => {
            socket.to(socket.boardId).emit('board update', savedBoard)
        })

    })
}

function emitTo({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    logger.debug('Emiting to user socket: ' + userId)
    const socket = await _getUserSocket(userId)
    if (socket) socket.emit(type, data)
    else {
        console.log('User socket not found')
        _printSockets()
    }
}

// Send to all sockets BUT not the current socket 
async function broadcast({ type, data, room = null }) {
    const excludedSocket = await _getUserSocket(userId)
    if (!excludedSocket) {
        return;
    }
    logger.debug('broadcast to all but user: ', userId)
    if (room) {
        excludedSocket.broadcast.to(room).emit(type, data)
    } else {
        excludedSocket.broadcast.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId == userId)
    return socket
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets()
    return sockets
}
// function _getAllSockets() {
//     const socketIds = Object.keys(gIo.sockets.sockets)
//     const sockets = socketIds.map(socketId => gIo.sockets.sockets[socketId])
//     return sockets;
// }

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    connectSockets,
    emitTo,
    emitToUser,
    broadcast,
}