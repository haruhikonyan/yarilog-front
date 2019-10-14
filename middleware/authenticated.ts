// import { Middleware } from '@nuxt/types';
// // from は types になぜかいない
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const authenticated: Middleware = ({ store, redirect, from }) => {
//   // ユーザが認証されていない場合
//   if (!store.state.auth) {
//     // from があれば path を callbackPath にいれる
//     if (from) {
//       return redirect('/login', { callbackPath: from.path });
//     }
//     return redirect('/login');
//   }
// };

// export default authenticated;

export default function({ store, redirect, from }) {
  // ユーザが認証されていない場合
  if (!store.state.auth) {
    // from があれば path を callbackPath にいれる
    if (from) {
      return redirect('/login', { callbackPath: from.path });
    }
    return redirect('/login');
  }
}
