export default {
    // Thêm không gian tên cho store, tránh trường hợp trùng tên action giữa các module => dispatch nhiều lần
    namespaced: true,
    state: () => ({
        isLoading: true,
    }),
    getters: {},
    mutations: {
        TOGGLE_LOADING(state) {
            state.isLoading = !state.isLoading;
        },
    },
    actions: {
        toggleLoading({ commit }) {
            commit('TOGGLE_LOADING');
        },
    }
  }