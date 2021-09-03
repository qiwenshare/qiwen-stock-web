import Vue from "vue";
import Vuex from "vuex";

import user from './module/user'  //  用户模块

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  getters: {
    // 登录状态
    isLogin: (state) => state.user.isLogin,
    // 用户姓名
    username: (state) => state.user.userInfoObj.username,
    // 用户ID
    userId: (state) => state.user.userInfoObj.userId
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user
  }
})
