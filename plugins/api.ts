import { User } from '~/models/User';
import { Composer } from '~/models/Composer';
import { Country } from '~/models/Country';
import * as urljoin from 'url-join';
import { PlayingLog, PlayingLogsWithCount } from '~/models/PlayingLog';
import { Tune, TunesWithCount, PlayStyle, TuneSearchObject, Genre } from '~/models/Tune';
import { LoginObject } from '~/models/LoginObject';
import { Instrument } from '~/models/Instrument';
import { LoginResultObject } from '~/models/LoginResultObject';

// TODO 開発終わったら or 必要なくなったら消す
import axios from 'axios';

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
  private readonly API_PLAYSTYLE_URL = 'playstyles';
  private readonly API_GENRE_URL = 'genres';
  private readonly API_TERMS_URL = 'terms';

  login(loginObject: LoginObject): Promise<LoginResultObject> {
    const url: string = urljoin(this.API_AUTH_URL, 'login');
    return this.context.$axios.$post(url, loginObject);
  }
  me(): Promise<string> {
    const url: string = urljoin(this.API_AUTH_URL, 'me');
    return this.context.$axios.$get(url);
  }
  getAuthObject(): Promise<LoginResultObject> {
    const url: string = urljoin(this.API_AUTH_URL, 'auth-object');
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
  updateUserMailAddress(mailAddress: string): Promise<User> {
    const url: string = urljoin(this.API_USER_URL, 'mail-address');
    return this.context.$axios.$post(url, { mailAddress });
  }
  updateUserNickname(nickname: string): Promise<User> {
    const url: string = urljoin(this.API_USER_URL, 'nickname');
    return this.context.$axios.$post(url, { nickname });
  }
  updateUserDescription(description: string): Promise<User> {
    const url: string = urljoin(this.API_USER_URL, 'description');
    return this.context.$axios.$post(url, { description });
  }
  consentTerms(concentTermsId: number) {
    const url: string = urljoin(this.API_USER_URL, 'consent-terms');
    return this.context.$axios.$post(url, { concentTermsId });
  }

  getComposers(): Promise<Composer[]> {
    const url = this.API_COMPOSER_URL;
    return this.context.$axios.$get(url);
  }
  getComposer(id: string): Promise<Composer> {
    const url: string = urljoin(this.API_COMPOSER_URL, id);
    return this.context.$axios.$get(url);
  }
  createComposer(composer: Composer): Promise<Composer> {
    return this.context.$axios.$post(this.API_COMPOSER_URL, composer);
  }
  getComposersByPlaystyleId(id: string): Promise<Composer[]> {
    const url: string = urljoin(this.API_COMPOSER_URL, 'playstyles', id);
    return this.context.$axios.$get(url);
  }
  searchComposers(searchWord): Promise<Composer[]> {
    const url = urljoin(this.API_COMPOSER_URL, 'search');
    return this.context.$axios.$get(url, {
      params: {
        searchWord
      }
    });
  }

  createCountry(country: Country): Promise<Country> {
    return this.context.$axios.$post(this.API_COUNTRY_URL, country);
  }
  getCountries(): Promise<Country[]> {
    return this.context.$axios.$get(this.API_COUNTRY_URL);
  }
  getCountry(id: string): Promise<Country> {
    const url: string = urljoin(this.API_COUNTRY_URL, id);
    return this.context.$axios.$get(url);
  }

  getTunes(): Promise<Tune[]> {
    const url = this.API_TUNE_URL;
    return this.context.$axios.$get(url);
  }
  getTune(id: string): Promise<Tune> {
    const url: string = urljoin(this.API_TUNE_URL, id);
    return this.context.$axios.$get(url);
  }
  getTuneforSelector(composerId: number, playstyleId: number): Promise<Tune[]> {
    const url: string = urljoin(this.API_TUNE_URL, 'tune-selector');
    return this.context.$axios.$get(url, {
      params: {
        composerId,
        playstyleId
      }
    });
  }
  createTune(tune: Tune): Promise<Tune> {
    return this.context.$axios.$post(this.API_TUNE_URL, tune);
  }

  searchTunes(
    tuneSearchObject: TuneSearchObject,
    offset?: number,
    limit?: number,
    playingLogLimit?: number
  ): Promise<TunesWithCount> {
    const url = urljoin(this.API_TUNE_URL, 'search');
    return this.context.$axios.$get(url, {
      params: {
        searchWord: tuneSearchObject.searchWord,
        offset,
        limit,
        playingLogLimit,
        instrumentId: tuneSearchObject.instrumentId,
        composerId: tuneSearchObject.composerId,
        playstyleId: tuneSearchObject.playstyleId,
        genreId: tuneSearchObject.genreId
      }
    });
  }

  addGenreToTune(tuneId: number, genreName: string): Promise<Tune> {
    const url = urljoin(this.API_TUNE_URL, tuneId.toString(), 'genre');
    return this.context.$axios.$put(url, { genreName });
  }

  getPlayingLogs(limit?: number, offset?: number): Promise<PlayingLog[]> {
    const url = this.API_PLAYING_LOG_URL;
    return this.context.$axios.$get(url, {
      params: {
        limit,
        offset
      }
    });
  }

  searchPlayingLogs(
    searchWord: string | null,
    instrumentId?: string | null,
    offset?: number,
    limit?: number
  ): Promise<PlayingLogsWithCount> {
    const url = urljoin(this.API_PLAYING_LOG_URL, 'search');
    return this.context.$axios.$get(url, {
      params: {
        searchWord,
        offset,
        limit,
        instrumentId
      }
    });
  }
  getPlayingLog(id: string): Promise<PlayingLog> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, id);
    return this.context.$axios.$get(url);
  }
  getPlayingLogsByTune(tuneId: string, offset?: number, limit?: number): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'tunes', tuneId);
    return this.context.$axios.$get(url, {
      params: {
        offset,
        limit
      }
    });
  }
  getPlayingLogsByComposer(composerId: string, offset?: number, limit?: number): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'composers', composerId);
    return this.context.$axios.$get(url, {
      params: {
        offset,
        limit
      }
    });
  }
  getPlayingLogsByCountry(countryId: string, offset?: number, limit?: number): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'countries', countryId);
    return this.context.$axios.$get(url, {
      params: {
        offset,
        limit
      }
    });
  }
  getPlayingLogsByInstrument(instrumentId: string, offset?: number, limit?: number): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'instruments', instrumentId);
    return this.context.$axios.$get(url, {
      params: {
        offset,
        limit
      }
    });
  }
  getPlayingLogsByUser(userId: string, offset?: number, limit?: number): Promise<PlayingLog[]> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, 'users', userId);
    return this.context.$axios.$get(url, {
      params: {
        offset,
        limit
      }
    });
  }
  createPlayingLog(plyaingLog: PlayingLog): Promise<PlayingLog> {
    return this.context.$axios.$post(this.API_PLAYING_LOG_URL, plyaingLog);
  }
  updatePlayingLog(plyaingLog: PlayingLog): Promise<PlayingLog> {
    const url: string = urljoin(this.API_PLAYING_LOG_URL, plyaingLog.id);
    return this.context.$axios.$put(url, plyaingLog);
  }

  getInstruments(): Promise<Instrument[]> {
    const url = this.API_INSTRUMENT_URL;
    return this.context.$axios.$get(url);
  }
  getInstrument(id: string): Promise<Instrument> {
    const url: string = urljoin(this.API_INSTRUMENT_URL, id);
    return this.context.$axios.$get(url);
  }

  getPlaystyles(): Promise<PlayStyle[]> {
    const url = this.API_PLAYSTYLE_URL;
    return this.context.$axios.$get(url);
  }

  searchGenres(searchWord): Promise<Genre[]> {
    const url = urljoin(this.API_GENRE_URL, 'search');
    return this.context.$axios.$get(url, {
      params: {
        searchWord
      }
    });
  }

  getLatestTermsId() {
    const url = urljoin(this.API_TERMS_URL, 'latest-id');
    return this.context.$axios.$get(url);
  }

  getLatestTos() {
    const url = urljoin(this.API_TERMS_URL, 'latest-tos');
    return this.context.$axios.$get(url);
  }

  getLatestPrivacyPolicy() {
    const url = urljoin(this.API_TERMS_URL, 'latest-privacy-policy');
    return this.context.$axios.$get(url);
  }

  // TODO 開発終わったら or 必要なくなったら消す
  async getInfo(): Promise<string> {
    const url = 'https://gist.githubusercontent.com/haruhikonyan/b7df281804d891c5da907ea16be83c65/raw/';
    const { data } = await axios.get(url);
    return data;
  }

  // TODO 開発終わったら or 必要なくなったら消す
  async getDevInfo(): Promise<string> {
    const url = 'https://gist.githubusercontent.com/haruhikonyan/935a14e3e9aa1c41522b6aa8e3b1fa6d/raw';
    const { data } = await axios.get(url);
    return data;
  }
}

export default (context, inject) => {
  inject('api', new Api(context));
};
