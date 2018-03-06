export const state = () => ({
  articles: []
})
export const getters = {
  authorMap: (state) => {
    return state.articles.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.author]: [...(prev[curr.author] || []), curr]
      }),
      {}
    )
  }
}
export const mutations = {
  setArticles(state, articles) {
    state.articles = articles
  }
}
export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    const data = (await app.$axios.get(process.env.PPTV_DATA_URL)).data
    commit('setArticles', data)
  }
}
