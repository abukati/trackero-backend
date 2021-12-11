const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
// const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
   try {
      const criteria = _buildCriteria(filterBy)
      const collection = await dbService.getCollection('board')
      const boards = await collection.find(criteria).toArray()
      return boards
   } catch (err) {
      logger.error('cannot find boards', err)
      throw err
   }
}

async function save(board) {
   const { title, createdBy, style, labels, members, groups, activities } = board
   let savedBoard
   if (board._id) {
      try {
         savedBoard = {
            _id: ObjectId(board._id),
            title,
            createdBy,
            style,
            labels,
            members,
            groups,
            activities: activities.slice(0, 20)
         }
         const collection = await dbService.getCollection('board')
         await collection.updateOne({ _id: savedBoard._id }, { $set: savedBoard })
         return savedBoard
      } catch (err) {
         logger.error('cannot update board', err)
         throw err
      }
   } else {
      try {
         savedBoard = {
            createdAt: ObjectId().getTimestamp(),
            title,
            createdBy,
            style,
            labels,
            members: [createdBy],
            groups,
            activities
         }
         const collection = await dbService.getCollection('board')
         await collection.insertOne(savedBoard)
         return savedBoard
      } catch (err) {
         logger.error('cannot add board', err)
         throw err
      }
   }
}

async function getById(boardId) {
   try {
      const collection = await dbService.getCollection('board')
      const board = await collection.findOne({ _id: ObjectId(boardId) })
      return board
   } catch (err) {
      logger.error(`while finding board ${boardId}`, err)
      throw err
   }
}

async function remove(boardId) {
   try {
      const collection = await dbService.getCollection('board')

      // remove only if user is owner/admin
      // const criteria = { _id: ObjectId(reviewId) }
      // if (!isAdmin) criteria.byUserId = ObjectId(userId)
      await collection.deleteOne({ _id: ObjectId(boardId) })
   } catch (err) {
      logger.error(`cannot remove board ${boardId}`, err)
      throw err
   }
}

function _buildCriteria(filterBy) {
   const criteria = {}
   const { ctg } = filterBy
   return ctg
}

module.exports = {
   query,
   remove,
   getById,
   save
}
