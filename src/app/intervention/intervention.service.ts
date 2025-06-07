import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Intervention } from './intervention';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  constructor(private httpClient: HttpClient) { }

  baseUrl: string = "http://localhost:3100/intervention";
  Url = "http://localhost:3100/getOrdreById";

  fetchAllInterventions(): Observable<Intervention[]> {
    return this.httpClient.get<Intervention[]>(`${this.baseUrl}`);
  }

  createIntervention(intervention: Intervention): Observable<any> {
    return this.httpClient.post<Intervention>(`${this.baseUrl}`, intervention);
  }

  /*updateIntervention(data: Intervention) {
    return this.httpClient.put<Intervention>(`${this.baseUrl}/${data.id_intervention}`, data);
  }*/

  updateIntervention(id_intervention: number, intervention: Intervention): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/${id_intervention}`, intervention);
  }

  deleteIntervention(id_intervention: Number) {
    return this.httpClient.delete<Intervention>(`${this.baseUrl}/${id_intervention}`);
  }


  getOrdreByTravaux(nom_travail: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/ordre/${nom_travail}`);

  }

  getTechnicienByMatricule(matricule_techn: Number) {
    return this.httpClient.get<any>(`${this.baseUrl}/technicien/${matricule_techn}`);

  }

  getAtelierByNom(nom_atelier: string) {
    return this.httpClient.get<any>(`${this.baseUrl}/atelier/${nom_atelier}`);

  }

  getOrdreById(id_ordre: Number): Observable<any> {
    return this.httpClient.get<any>(`${this.Url}/${id_ordre}`);
  }

  //Un Blob (objet binaire) est un type de données qui représente un fichier brut comme (pdf, image, word, vidéo...)
  generatePdfIntervention(id_intervention: number): Observable<Blob> {
    return this.httpClient.get<Blob>(`${this.baseUrl}/generatePdf/${id_intervention}`, { responseType: 'blob' as 'json' }); //pour recevoir le fichier
  }


  ApiUrl: string = "http://localhost:3100/infosIntervention";

  fetchAllOrdre(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/Ordre`);
  }

  fetchAllTechnicien(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/technicien`);
  }

  fetchAllAtelier(): Observable<any> {
    return this.httpClient.get(`${this.ApiUrl}/atelier`);
  }



  // Recherche des demandes avec des paramètres filtrés
  searchIntervention(params: any): Observable<Intervention[]> {
    let httpParams = new HttpParams();

    // Ajouter chaque paramètre de recherche non vide à HttpParams
    for (const key in params) {
      if (params[key] && params[key] !== '') {
        httpParams = httpParams.set(key, params[key]);
      }
    }

    // Envoi de la requête GET avec les paramètres filtrés
    return this.httpClient.get<Intervention[]>(this.baseUrl, { params: httpParams });
  }

}
