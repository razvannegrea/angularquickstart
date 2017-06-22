import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(private http: Http) {}

  retrieveHeroesFromExternalResource(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json().data as Hero[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred while calling the service', error);
    return Promise.reject(error.message || error);
  }

  getHeroes(): Promise<Hero[]> {
    // SIMULATE LATENCY:
    return new Promise(resolve => {
      setTimeout(() => resolve(this.retrieveHeroesFromExternalResource()), 800);
    });
  }

  getHero(id: number): Promise<Hero> {
    return this.getHeroes().then(heroes => heroes.find(hero => hero.id === id));
  }
}

