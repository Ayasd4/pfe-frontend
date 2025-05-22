import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsulterService {
  baseUrl: String = "http://localhost:3100/getDetailsOrder";

  constructor(private httpClient: HttpClient) { }

  getDetailsOrder(id_ordre: Number) {
    return this.httpClient.get<any>(`${this.baseUrl}/${id_ordre}`);
  }

}
