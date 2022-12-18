<template>
  <div class="container home">
    <ul class="task-list">
      <li v-for="task in tasks" :key="task._id">
        <p>
          "{{ task.title }}"
        </p>
        <p>
          Status: {{ task.status }}
        </p>
        <p v-if="task.triesCount != 0">
          Tries count: {{ task.triesCount }}
        </p>
        <button @click="removeTask(task._id)">x</button>
        <button @click="updateTask(task)">Update</button>
        <hr />
        <button @click="startTask(task._id)">Start Task</button>

      </li>
    </ul>
    <hr />
    <form @submit.prevent="addTask()">
      <h2>Add task</h2>
      <input type="text" v-model="taskToAdd.title" />
      <button>Save</button>
    </form>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { taskService } from '../services/task.service.js'
import { getActionRemoveTask, getActionUpdateTask, } from '../store/task.store.js'
export default {
  data() {
    return {
      taskToAdd: taskService.getEmptyTask()
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    tasks() {
      return this.$store.getters.tasks
    }
  },
  created() {
    this.$store.dispatch({ type: 'loadTasks' })
  },
  methods: {
    async addTask() {
      try {
        await this.$store.dispatch({ type: 'addTask', task: this.taskToAdd })
        showSuccessMsg('Task added')
        this.taskToAdd = taskService.getEmptyTask()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add task')
      }
    },
    async removeTask(taskId) {
      try {
        await this.$store.dispatch(getActionRemoveTask(taskId))
        showSuccessMsg('Task removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove task')
      }
    },
    async updateTask(task) {
      try {
        task = { ...task }
        task.price = +prompt('New price?', task.price)
        await this.$store.dispatch(getActionUpdateTask(task))
        showSuccessMsg('Task updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update task')
      }
    },
    async startTask(taskId) {
      try {
        await this.$store.dispatch({ type: 'startTask', taskId })
        showSuccessMsg('Task started')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot start task')
      }
    },
  }


}
</script>
