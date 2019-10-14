// import { Middleware } from '@nuxt/types';
// from は types になぜかいなく、エラー出るので一旦 any に
const authenticated: any = ({ store, redirect, from }) => {
  // ユーザが認証されていない場合
  if (!store.state.auth) {
    // from があれば path を callbackPath にいれる
    if (from) {
      return redirect('/login', { callbackPath: from.path });
    }
    return redirect('/login');
  }
};

export default authenticated;
