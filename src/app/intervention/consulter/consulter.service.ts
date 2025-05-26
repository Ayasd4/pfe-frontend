import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordre } from 'src/app/ordre/ordre';

@Injectable({
  providedIn: 'root'
})
export class ConsulterService {
  baseUrl: String = "http://localhost:3100/getDetailsOrder";
  Url: string = "http://localhost:3100/intervByOrdre";

  constructor(private httpClient: HttpClient) { }

  getDetailsOrder(id_ordre: number): Observable<Ordre[]>  {
    return this.httpClient.get<Ordre[]>(`${this.baseUrl}/${id_ordre}`);
  }

  getInterventionByOrder(id_ordre: number): Observable<any[]>  {
    return this.httpClient.get<any[]>(`${this.Url}/${id_ordre}`);
  }

}
