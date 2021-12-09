const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
// const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoard, deleteBoard, addBoard, updateBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getBoards)

router.get('/', getBoards)

router.get('/:boardId', getBoard)
// router.post('/', requireAuth, requireAdmin, addBoard)
router.post('/', addBoard)
// router.put('/:boardId', requireAuth, requireAdmin, updateBoard)
router.put('/:boardId', updateBoard)
// router.delete('/:boardId', requireAuth, requireAdmin, removeBoard)
router.delete('/:boardId', deleteBoard)

module.exports = router