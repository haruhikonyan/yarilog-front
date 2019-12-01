import { Middleware } from '@nuxt/types';
import { LoginResultObject } from '~/models/LoginResultObject';

const authenticated: Middleware = ({ store, redirect, route }) => {
  const auth: LoginResultObject = store.state.auth;
  // ユーザが認証されていない場合
  if (!auth) {
    return redirect('/login', { callbackPath: route.fullPath });
  }
  // 最新の規約に同意していない場合
  if (!auth.consentTos) {
    return redirect('/terms/consent', { callbackPath: route.fullPath });
  }
};

export default authenticated;
