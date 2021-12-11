const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser, updateUser } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/:userId',getUser)
router.put('/:userId', updateUser)
router.delete('/:userId',deleteUser)

// router.put('/:userId',  requireAuth, updateUser)

module.exports = router