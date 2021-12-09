const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {
   try {
      const criteria = _buildCriteria(filterBy)
      // const criteria = {}
      // console.log('criteria', criteria)
      const collection = await dbService.getCollection('board')
      var sortBy = filterBy.sort
      // console.log('sortBy', sortBy)
      var sorted = { [sortBy]: 1 }
      var boards = await collection.find(criteria).sort(sorted).toArray()

      console.log(boards)
      return boards
   } catch (err) {
      logger.error('cannot find boards', err)
      throw err
   }
}

async function getById(boardId) {
   try {
      const collection = await dbService.getCollection('board')
      const board = collection.findOne({ _id: ObjectId(boardId) })
      return board
   } catch (err) {
      logger.error(`while finding board ${boardId}`, err)
      throw err
   }
}

async function remove(boardId) {
   try {
      const collection = await dbService.getCollection('board')
      await collection.deleteOne({ _id: ObjectId(boardId) })
      return boardId
   } catch (err) {
      logger.error(`cannot remove board ${boardId}`, err)
      throw err
   }
}

async function add(board) {
   try {
      const collection = await dbService.getCollection('board')
      delete board._id
      const addedBoard = await collection.insertOne(board)
      const id = addedBoard.insertedId.toString()
      // console.log('addedBoard', addedBoard)
      return addedBoard
   } catch (err) {
      logger.error('cannot insert board', err)
      throw err
   }
}
async function update(board) {
   try {
      var id = ObjectId(board._id)
      delete board._id
      const collection = await dbService.getCollection('board')
      await collection.updateOne({ _id: id }, { $set: { ...board } })
      return board
   } catch (err) {
      logger.error(`cannot update board ${board._id}`, err)
      throw err
   }
}

function _buildCriteria(filterBy) {
   const criteria = {}
   //  if (filterBy.name) {
   //     const txtCriteria = { $regex: filterBy.name, $options: 'i' }
   //     criteria.name = txtCriteria
   //  }
   //  if (filterBy.label && filterBy.label.length) {
   //     criteria.label = { $in: filterBy.label }
   //  }

   return criteria
}

module.exports = {
   remove,
   query,
   getById,
   add,
   update
}
