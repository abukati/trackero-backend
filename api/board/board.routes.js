const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, getBoard, deleteBoard, addBoard, updateBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.get('/:id', log, getBoard)
router.post('/',  log, requireAuth, addBoard)
router.put('/',  log, requireAuth, updateBoard)
router.delete('/:id',  requireAuth, deleteBoard)

module.exports = router