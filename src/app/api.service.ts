import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Character } from './character';
import { Location } from './location';
import { Episode } from './episode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  characterId=1
  displayCharacter=false

  getCharacters(page:number):Observable<Character[]> {
    return this.httpClient.get<Character[]>(`https://rickandmortyapi.com/api/character/?page=${page}`).pipe(
      map((data:any) => data.results)
    );
  }

  getCharacter(id:number): Observable<Character>{
    return this.httpClient.get<Character>(`https://rickandmortyapi.com/api/character/${id}`).pipe(
      map((data: any) => data)
    );
  }

  getCharacterByUrl(url:string): Observable<Character>{
    return this.httpClient.get<Character>(`${url}`).pipe(
      map((data: any) => data)
    );
  }

  getLocations(page: number):Observable<Location[]>{
    return this.httpClient.get<Location>(`https://rickandmortyapi.com/api/location/?page=${page}`).pipe(
      map((data:any) => data.results),
      catchError(error => {
        if (error.status === 404) {
          return of([]);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  getLocation(id:number):Observable<Location>{
    return this.httpClient.get<Location>(`https://rickandmortyapi.com/api/location/${id}`).pipe(
      map((data:any) => data)
    );
  }

  getEpisodes(page:number):Observable<Episode[]>{
    return this.httpClient.get<Episode>(`https://rickandmortyapi.com/api/episode/?page=${page}`).pipe(
      map((data:any) => data.results),
      catchError(error => {
        if (error.status === 404) {
          return of([]);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  getEpisode(id:number):Observable<Episode>{
    return this.httpClient.get<Episode>(`https://rickandmortyapi.com/api/episode/${id}`).pipe(
      map((data:any) => data)
    );
  }

  getCharactersPage(page: number, name: string): Observable<Character[]> {
    return this.httpClient.get<Character[]>(`https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`).pipe(
      map((data: any) => data.results),
      catchError(error => {
        if (error.status === 404) {
          return of([]);
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
