import { taskService } from '../services/task.service.js'

export function getActionRemoveTask(taskId) {
    return {
        type: 'removeTask',
        taskId
    }
}
export function getActionAddTask(task) {
    return {
        type: 'addTask',
        task
    }
}
export function getActionUpdateTask(task) {
    return {
        type: 'updateTask',
        task
    }
}

// export function getActionAddTaskMsg(taskId) {
//     return {
//         type: 'addTaskMsg',
//         taskId,
//         txt: 'Stam txt'
//     }
// }

export const taskStore = {
    state: {
        tasks: []
    },
    getters: {
        tasks({ tasks }) { return tasks },
    },
    mutations: {
        setTasks(state, { tasks }) {
            state.tasks = tasks
        },
        addTask(state, { task }) {
            state.tasks.push(task)
        },
        updateTask(state, { task }) {
            const idx = state.tasks.findIndex(c => c.id === task._id)
            state.tasks.splice(idx, 1, task)
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id !== taskId)
        },
        addTaskMsg(state, { taskId, msg }) {
            const task = state.tasks.find(task => task._id === taskId)
            if (!task.msgs) task.msgs = []
            task.msgs.push(msg)
        },
    },
    actions: {
        async addTask(context, { task }) {
            try {
                task = await taskService.save(task)
                context.commit(getActionAddTask(task))
                return task
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async updateTask(context, { task }) {
            try {
                task = await taskService.save(task)
                context.commit(getActionUpdateTask(task))
                return task
            } catch (err) {
                console.log('taskStore: Error in updateTask', err)
                throw err
            }
        },
        async loadTasks(context) {
            try {
                const tasks = await taskService.query()
                context.commit({ type: 'setTasks', tasks })
            } catch (err) {
                console.log('taskStore: Error in loadTasks', err)
                throw err
            }
        },
        async removeTask(context, { taskId }) {
            try {
                await taskService.remove(taskId)
                context.commit(getActionRemoveTask(taskId))
            } catch (err) {
                console.log('taskStore: Error in removeTask', err)
                throw err
            }
        },
        async startTask(context, { taskId }) {
            try {
                const task = await taskService.startTask(taskId)
                context.commit({ type: 'updateTask', task })
            } catch (err) {
                console.log('taskStore: Error in addTaskMsg', err)
                throw err
            }
        },

    }
}