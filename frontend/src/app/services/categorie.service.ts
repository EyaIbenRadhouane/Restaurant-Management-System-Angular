import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategorieService {

  private url = `${environment.apiUrl}/${environment.prefix}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.url);
  }

  getById(id: string): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.url}/${id}`);
  }

  create(cat: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(this.url, cat);
  }

  update(id: string, cat: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.url}/${id}`, cat);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}