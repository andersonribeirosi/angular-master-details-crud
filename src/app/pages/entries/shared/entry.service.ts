import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError, flatMap } from 'rxjs/operators';
import { EntryModel } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService) { }

  getAll(): Observable<EntryModel[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<EntryModel> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        return this.http.put(url, entry).pipe(
          catchError(this.handleError),
          map(() => entry)
        )
      })
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  //PRIVATE METHODS
  private jsonDataToEntries(jsonData: any[]): EntryModel[] {
    const entries: EntryModel[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new EntryModel(), element);
      entries.push(entry);
    });
    return entries;
  }


  private jsonDataToEntry(jsonData: any): EntryModel {
    return Object.assign(new EntryModel(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log("erro na requisição =>", error);
    return throwError(error);
  }
}

