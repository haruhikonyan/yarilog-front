const cookieparser = process.server ? require('cookieparser') : undefined;

export const state = () => {
  return {
    auth: null,
    instruments: [],
    playstyles: []
  };
};
export const mutations = {
  setAuth(state, auth) {
    state.auth = auth;
  },
  setInstruments(state, instruments) {
    state.instruments = instruments;
  },
  setPlaystyles(state, playstyles) {
    state.playstyles = playstyles;
  }
};
export const actions = {
  async nuxtServerInit({ commit }, { req, $axios, app }) {
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      if (parsed.token) {
        $axios.setToken(parsed.token, 'Bearer');
        const auth = await app.$api.getAuthObject();
        commit('setAuth', auth);
      }
    }
    // 楽器マスタを持っておく
    const instruments = await app.$api.getInstruments();
    const playstyles = await app.$api.getPlaystyles();

    commit('setInstruments', instruments);
    commit('setPlaystyles', playstyles);
  }
};
