import { User } from "~/models/User";
import { Composer } from "~/models/Composer";
import { Country } from "~/models/Country";
import * as urljoin from 'url-join';
import { PlayingLog } from "~/models/PlayingLog";

export class Api {
  // TODO この context の型取得したい
  private readonly context
  constructor(context) {
    this.context = context;
  }
  private readonly API_USER_URL = 'users';
  private readonly API_COMPOSER_URL = 'composers';
  private readonly API_COUNTRY_URL = 'countries';
  private readonly API_PLAYING_LOG_URL = 'playing-logs';

  getUsers(): Promise<User[]> {
    const url = this.API_USER_URL;
    return this.context.$axios.$get(url)
  }
  getUser(id: string): Promise<User[]> {    
    const url: string = urljoin(this.API_USER_URL, id);
    return this.context.$axios.$get(url)
  }
  createUser(user: User): Promise<User> {
    return this.context.$axios.$post(this.API_USER_URL, {
      name: user.name,
      description: user.description
    })
  }
  
  createComposer(composer: Composer): Promise<Composer> {
    return this.context.$axios.$post(this.API_COMPOSER_URL, composer)
  }
  
  createCountry(country: Country): Promise<Country> {
    return this.context.$axios.$post(this.API_COUNTRY_URL, country)
  }

  getPlayingLogs(): Promise<PlayingLog[]> {
    const url = this.API_PLAYING_LOG_URL;
    return this.context.$axios.$get(url)
  }
  getPlayingLog(id: string): Promise<PlayingLog[]> {    
    const url: string = urljoin(this.API_PLAYING_LOG_URL, id);
    return this.context.$axios.$get(url)
  }
  createPlayingLog(plyaingLog: PlayingLog): Promise<PlayingLog> {
    return this.context.$axios.$post(this.API_PLAYING_LOG_URL, plyaingLog)
  }
}

export default (context, inject) => {
  inject('api', new Api(context))
}