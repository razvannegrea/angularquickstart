import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes';
  private headers = new Headers({'Content-Type' : 'application/json'});

  constructor(private http: Http) {}

  retrieveHeroesFromExternalResource(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json().data as Hero[])
      .catch(this.handleError);
    // THE .data PROPERTY ON THE json() RESULT IS SPECIFIC TO THE IN MEMORY WEB API. OTHER WEB APIs have other properties.
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
    const heroByIdUrl = `${this.heroesUrl}/${id}`;
    return this.http.get(heroByIdUrl)
      .toPromise()
      .then(response => response.json().data as Hero)
      .catch(this.handleError);
  }

  update(hero: Hero): Promise<Hero> {
    const updateHeroUrl = `${this.heroesUrl}/${hero.id}`;

    return this.http.put(updateHeroUrl, JSON.stringify(hero), {headers: this.headers})
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  create(name: string): Promise<Hero> {
    return this.http.post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(resp => resp.json().data as Hero)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const deleteHeroUrl = `${this.heroesUrl}/${id}`;
    return this.http.delete(deleteHeroUrl, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
}

