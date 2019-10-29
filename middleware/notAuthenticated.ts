import { Middleware } from '@nuxt/types';
const notAuthenticated: Middleware = ({ store, redirect }) => {
  // ユーザが認証されていた場合のリダイレクト
  if (store.state.auth) {
    return redirect('/');
  }
};

export default notAuthenticated;
