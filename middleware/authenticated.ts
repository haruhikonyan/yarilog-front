import { Middleware } from '@nuxt/types';
const authenticated: Middleware = ({ store, redirect }) => {
  // ユーザが認証されていない場合
  if (!store.state.auth) {
    return redirect('/login');
  }
};

export default authenticated;
