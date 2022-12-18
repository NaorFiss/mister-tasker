const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const externalService = require('../../services/external.service.js')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
    try {
        const criteria = {
            title: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('task')
        var tasks = await collection.find(criteria).toArray()
        return tasks
    } catch (err) {
        logger.error('cannot find tasks', err)
        throw err
    }
}

async function getById(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        const task = collection.findOne({ _id: ObjectId(taskId) })
        return task
    } catch (err) {
        logger.error(`while finding task ${taskId}`, err)
        throw err
    }
}

async function remove(taskId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.deleteOne({ _id: ObjectId(taskId) })
        return taskId
    } catch (err) {
        logger.error(`cannot remove task ${taskId}`, err)
        throw err
    }
}

async function add(task) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.insertOne(task)
        return task
    } catch (err) {
        logger.error('cannot insert task', err)
        throw err
    }
}

async function update(task) {
    try {
        const taskToSave = {
            title: task.title,
            status: task.status,
            description: task.description,
            importance: task.importance,
            createdAt: task.createdAt,
            lastTriedAt: task.lastTriedAt,
            triesCount: task.triesCount,
            doneAt: task.doneAt,
            errors: task.errors,
            lastTried: task.lastTried
        }
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: ObjectId(task._id) }, { $set: taskToSave })
        return task
    } catch (err) {
        logger.error(`cannot update task ${taskId}`, err)
        throw err
    }
}

async function performTask(task) {
    try {
        // TODO: update task status to running and save to DB
        task.status = "running"
        await update(task)
        // TODO: execute the task using: externalService.execute
        externalService.execute(task)
            .then((value) => {
                task.status = "done"
                task.doneAt = new Date()
                console.log("value: ", value)
            })
            .catch((error) => {
                task.status = "failed"
                task.errors.push(error)
                console.log("error: ", error)
            })

        // just for running. need to be deleted after
        if (Math.random() > 0.5) {
            task.status = "done"
            task.doneAt = new Date()
        }
        else {
            task.status = "failed"
            task.errors.push(error)
        }
        // 

        await update(task)
    } catch (error) {
        logger.error(`cannot perform task ${taskId}`, err)
        throw err
    } finally {
        // TODO: update task lastTried, triesCount and save to DB
        task.lastTried = new Date()
        task.triesCount++
        await update(task)
        return task
    }
}

async function addTaskMsg(taskId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: ObjectId(taskId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add task msg ${taskId}`, err)
        throw err
    }
}

async function removeTaskMsg(taskId, msgId) {
    try {
        const collection = await dbService.getCollection('task')
        await collection.updateOne({ _id: ObjectId(taskId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add task msg ${taskId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    performTask,
    addTaskMsg,
    removeTaskMsg
}
