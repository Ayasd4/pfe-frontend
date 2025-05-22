import { Component, OnInit } from '@angular/core';
import { Ordre } from 'src/app/ordre/ordre';
import { ConsulterService } from './consulter.service';

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrls: ['./consulter.component.css']
})
export class ConsulterComponent implements OnInit {
  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;

  constructor(private consultService: ConsulterService){}
  
  ordre: Ordre = {
    id_ordre: 0,
    diagnostic: {
      id_diagnostic: 0,
      demande: {
        id_demande: 0,
        type_avarie: '',
        description: '',
        vehicule: { numparc: this.numparc }
      },
      description_panne: '',
      causes_panne: '',
      actions: '',
      date_diagnostic: '',
      heure_diagnostic: ''
    },
    urgence_panne: '',
    travaux: { id_travaux: 0, nom_travail: '', type_atelier: '' },
    planning: '',
    date_ordre: '',
    status: '',
    atelier: {
      id_atelier: 0,
      nom_atelier: '',
      telephone: '',
      email: '',
      capacite: this.capacite,
      statut: ''
    },
    technicien: {
      id_technicien: 0,
      nom: '',
      prenom: '',
      matricule_techn: this.matricule_techn,
      cin: '',
      telephone_techn: '',
      email_techn: '',
      specialite: '',
      date_embauche: '',
      image: ''
    }
  }
  ordres: Ordre[] = [];

  ngOnInit(): void {
    const id_ordre = this.ordre.id_ordre;
    this.consultService.getDetailsOrder(id_ordre).subscribe({
      next: (data) => {
        this.ordres = data[0]; // car `rows` est un tableau
      },
      error: (err) => {
        console.error('Error while récupération orders:', err);
      }
    });
  }

}
