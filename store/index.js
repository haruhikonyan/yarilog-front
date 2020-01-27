const cookieparser = process.server ? require('cookieparser') : undefined;

export const state = () => {
  return {
    auth: null,
    instruments: [],
    playstyles: [],
    playingLogsCount: 0,
    allHasPlayingLogTunesCount: 0
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
  },
  setPlayingsLogCount(state, playingLogsCount) {
    state.playingLogsCount = playingLogsCount;
  },
  setAllHasPlayingLogTunesCount(state, allHasPlayingLogTunesCount) {
    state.allHasPlayingLogTunesCount = allHasPlayingLogTunesCount;
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
        app.$api.updateLatestLoginAt();
      }
    }
    // 楽器マスタを持っておく
    const instruments = await app.$api.getInstruments();
    const playstyles = await app.$api.getPlaystyles();
    const playingsLogCount = await app.$api.getPlayingsLogCount();
    const allHasPlayingLogTunesCount = await app.$api.getAllHasPlayingLogTunesCount();

    commit('setInstruments', instruments);
    commit('setPlaystyles', playstyles);
    commit('setPlayingsLogCount', playingsLogCount);
    commit('setAllHasPlayingLogTunesCount', allHasPlayingLogTunesCount);
  }
};
