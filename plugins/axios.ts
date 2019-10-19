import Cookie from 'js-cookie';

export default ({ $axios, store, redirect }) => {
  // auth があれば CSR 用に token をセットする
  const auth = store.state.auth;
  if (auth != null) {
    $axios.setToken(auth.token, 'Bearer');
  }
  $axios.onError(error => {
    if (error.response.status === 401) {
      Cookie.remove('auth');
      store.commit('setAuth', null);
      $axios.setToken(false);
      redirect('/login');
    }
    if (error.response.status === 404) {
      // TODO 404 の処理
    }
  });
};
