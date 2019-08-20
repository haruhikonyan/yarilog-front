const cookieparser = process.server ? require('cookieparser') : undefined;

export const state = () => {
  return {
    auth: null,
    instruments: null
  };
};
export const mutations = {
  setAuth(state, auth) {
    state.auth = auth;
  },
  setInstruments(state, instruments) {
    state.instruments = instruments;
  }
};
export const actions = {
  async nuxtServerInit({ commit }, { req, $axios, app }) {
    let auth = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        auth = JSON.parse(parsed.auth);
        $axios.setToken(auth.accessToken, 'Bearer');
      } catch (err) {
        // No valid cookie found
      }
    }
    // 楽器マスタを持っておく
    const instruments = await app.$api.getInstruments();
    commit('setAuth', auth);
    commit('setInstruments', instruments);
  }
};
