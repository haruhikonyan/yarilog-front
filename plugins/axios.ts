import Cookie from 'js-cookie';

export default ({ $axios, store, redirect, nuxtState }) => {
  // auth があれば CSR 用に token をセットする
  const auth = store.state.auth;
  if (auth != null) {
    $axios.setToken(auth.accessToken, 'Bearer');
  }
  $axios.onError(error => {
    if (error.response.status === 401) {
      Cookie.remove('auth');
      store.commit('setAuth', null);
      $axios.setToken(false);
      redirect('/login');
    }
  });
};
