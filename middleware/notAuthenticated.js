export default function({ store, redirect }) {
  // ユーザが認証されていた場合のリダイレクト
  if (store.state.auth) {
    return redirect('/');
  }
}
