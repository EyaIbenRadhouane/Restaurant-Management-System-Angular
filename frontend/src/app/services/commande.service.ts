import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommandeService {

  private url = `${environment.apiUrl}/${environment.prefix}/commandes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.url);
  }

  getById(id: string): Observable<Commande> {
    return this.http.get<Commande>(`${this.url}/${id}`);
  }

  create(cmd: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.url, cmd);
  }

  updateStatut(id: string, statut: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.url}/${id}`, { statut });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}