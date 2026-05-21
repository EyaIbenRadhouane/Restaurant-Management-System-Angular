import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plat } from '../models/plat';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlatService {

  private url = `${environment.apiUrl}/${environment.prefix}/plats`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.url);
  }

  // Recherche par nom
  rechercher(nom: string): Observable<Plat[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<Plat[]>(`${this.url}/search`, { params });
  }

  // Filtre par catégorie
  parCategorie(categorieId: string): Observable<Plat[]> {
    return this.http.get<Plat[]>(`${this.url}/categorie/${categorieId}`);
  }

  getById(id: string): Observable<Plat> {
    return this.http.get<Plat>(`${this.url}/${id}`);
  }

  create(plat: Plat): Observable<Plat> {
    return this.http.post<Plat>(this.url, plat);
  }

  update(id: string, plat: Plat): Observable<Plat> {
    return this.http.put<Plat>(`${this.url}/${id}`, plat);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}