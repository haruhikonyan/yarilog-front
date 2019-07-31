import { User } from "~/models/User";
import { Composer } from "~/models/Composer";
import { Country } from "~/models/Country";
import * as urljoin from 'url-join';
import { PlayingLog } from "~/models/PlayingLog";
import { Tune } from "~/models/Tune";
import { LoginObject } from "~/models/LoginObject";
import { Instrument } from "~/models/Instrument";

export class Api {
  // TODO この context の型取得したい
  private readonly context;
  constructor(context) {
    this.context = context;
  }
  private readonly API_AUTH_URL = 'auth';
  private readonly API_USER_URL = 'users';
  private readonly API_COMPOSER_URL = 'composers';
  private readonly API_COUNTRY_URL = 'countries';
  private readonly API_TUNE_URL = 'tunes';
  private readonly API_PLAYING_LOG_URL = 'playing-logs';
  private readonly API_INSTRUMENT_URL = 'instruments';

  login(loginObject: LoginObject): Promise<string> {
    const url: string = urljoin(this.API_AUTH_URL, 'login');
    return this.context.$axios.$post(url, loginObject);
  }
  me(): Promise<string> {
    const url: string = urljoin(this.API_AUTH_URL, 'me');
    return this.context.$axios.$get(url);
  }

  getUsers(): Promise<User[]> {
    const url = this.API_USER_URL;
    return this.context.$axios.$get(url);
  }
  getUser(id: string): Promise<User[]> {    
    const url: string = urljoin(this.API_USER_URL, id);
    return this.context.$axios.$get(url);
  }
  createUser(user: User): Promise<User> {
    return this.context.$axios.$post(this.API_USER_URL, user);
  }

  getComposers(): Promise<Composer[]> {
    const url = this.API_COMPOSER_URL;
    return this.context.$axios.$get(url)
  }
  
  createComposer(composer: Composer): Promise<Composer> {
    return this.context.$axios.$post(this.API_COMPOSER_URL, composer)
  }
  
  createCountry(country: Country): Promise<Country> {
    return this.context.$axios.$post(this.API_COUNTRY_URL, country)
  }
  getCountries(): Promise<Country[]> {
    return this.context.$axios.$get(this.API_COUNTRY_URL)
  }
  getCountry(id: string): Promise<Country> {
    const url: string = urljoin(this.API_COUNTRY_URL, id);
    return this.context.$axios.$get(url);
  }

  getTunes(): Promise<Tune[]> {
    const url = this.API_TUNE_URL;
    return this.context.$axios.$get(url)
  }
  
  createTune(tune: Tune): Promise<Tune> {
    return this.context.$axios.$post(this.API_TUNE_URL, tune)
  }

  getPlayingLogs(): Promise<PlayingLog[]> {
    const url = this.API_PLAYING_LOG_URL;
    return this.context.$axios.$get(url)
  }
  getPlayingLog(id: string): Promise<PlayingLog> {    
    const url: string = urljoin(this.API_PLAYING_LOG_URL, id);
    return this.context.$axios.$get(url)
  }
  getPlayingLogsByComposer(composerId: string): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'composers', composerId);
    return this.context.$axios.$get(url)
  }
  getPlayingLogsByCountry(countryId: string): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'countries', countryId);
    return this.context.$axios.$get(url)
  }
  getPlayingLogsByInstrument(instrumentId: string): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'instruments', instrumentId);
    return this.context.$axios.$get(url)
  }
  createPlayingLog(plyaingLog: PlayingLog): Promise<PlayingLog> {
    return this.context.$axios.$post(this.API_PLAYING_LOG_URL, plyaingLog)
  }

  getInstruments(): Promise<Instrument[]> {
    const url = this.API_INSTRUMENT_URL;
    return this.context.$axios.$get(url)
  }
  getInstrument(id: string): Promise<Instrument> {
    const url: string = urljoin(this.API_INSTRUMENT_URL, id);
    return this.context.$axios.$get(url)
  }

  getInfo(): Promise<string> {
    const url = 'https://gist.githubusercontent.com/haruhikonyan/b7df281804d891c5da907ea16be83c65/raw/'
    this.context.$axios.defaults.headers.common = {};
    return this.context.$axios.$get(url);
  }
}

export default (context, inject) => {
  inject('api', new Api(context))
}