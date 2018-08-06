/**
 * Created by  on 2016/4/1.
 */
const error = {
  state: {
    errCode: '',
    errMsg: ''
  },
  mutations: {
    SET_ERROR: (state, {
      errCode,
      errMsg
    }) => {
      state.errCode = errCode
      state.errMsg = errMsg
    }
  },
  actions: {
    setError({
      commit
    }, error) {
      return new Promise((resolve, reject) => {
        commit('SET_ERROR', error)
        resolve()
      })
    }
  }
}

export default error
