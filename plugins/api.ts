import { User } from "~/models/User";

export class Api {
  // TODO この context の型取得したい
  private readonly context
  constructor(context) {
    this.context = context;
  }
  getUsers(): Promise<User[]> {
    return this.context.$axios.$get('users')
  }
  createUser(user: User): Promise<User> {
    return this.context.$axios.$post('http://localhost:8080/users', {
      name: user.name,
      description: user.description
    })
  }
}

export default (context, inject) => {
  inject('api', new Api(context))
}