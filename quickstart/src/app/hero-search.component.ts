import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { HeroSearchService } from './hero-search.service';
import { Hero } from './hero';

@Component({
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {

  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroSearchService: HeroSearchService, private router: Router) {}

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300) // wait for the specified amount of time after each keystroke before considering the term.
      .distinctUntilChanged() // ignore if next search term is the same as previous
      .switchMap(term => term
        ? this.heroSearchService.search(term)
        : Observable.of<Hero[]>([])) // switch to the new observable each time the term changes
      .catch(error => {
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  gotoDetail(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }

}
