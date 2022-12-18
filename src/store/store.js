import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { taskStore } from './task.store.js'
import { reviewStore } from './review.store.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    userStore,
    taskStore,
    reviewStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
