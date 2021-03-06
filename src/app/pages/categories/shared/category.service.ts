import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CategoryModel } from './category.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError, flatMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'api/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryModel[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<CategoryModel>{
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: CategoryModel): Observable<CategoryModel>{
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: CategoryModel): Observable<CategoryModel>{
    const url = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    )
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  //PRIVATE METHODS
  private jsonDataToCategories(jsonData: any[]): CategoryModel[]{
    const categories: CategoryModel[] = [];
    jsonData.forEach(element => categories.push(element as CategoryModel));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): CategoryModel{
    return jsonData as CategoryModel;
  }

  private handleError(error: any): Observable<any>{
    console.log("erro na requisição =>", error);
    return throwError(error);
  }
}

