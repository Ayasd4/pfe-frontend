import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Ordre } from 'src/app/ordre/ordre';
import { ConsulterService } from './consulter.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrdreService } from 'src/app/ordre/ordre.service';
import { Intervention } from '../intervention';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InterventionService } from '../intervention.service';
import { AddInterventionComponent } from '../add-intervention/add-intervention.component';
import { Atelier } from 'src/app/atelier/atelier';
import { Diagnostic } from 'src/app/maintenance/diagnostic/diagnostic';
import { Travaux } from 'src/app/ordre/travaux';
import { Technicien } from 'src/app/technicien/technicien';
import { routes } from 'src/app/app-routing.module';


@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrls: ['./consulter.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
  ],

})
export class ConsulterComponent implements OnInit {


  capacite: any = undefined;
  matricule_techn: any = undefined;
  numparc: any = undefined;

  displayedColumns: string[] = ['id_intervention', 'Vehicle', 'technicien', 'date_debut', 'date_fin', 'status', 'commentaire', 'atelier', 'actions'];
  dataSource = new MatTableDataSource<Intervention>();
  filtredIntervention: Intervention[] = [];

  constructor(private consultService: ConsulterService,
    private cd: ChangeDetectorRef,
    //public dialogRef: MatDialogRef<ConsulterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private interventionService: InterventionService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private ordreService: OrdreService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.ordre.travaux.nom_travail = data.nom_travail;

    this.ordre.id_ordre = data.id_ordre;
    this.ordre.urgence_panne = data.urgence_panne;
    this.ordre.planning = data.planning;
    this.ordre.date_ordre = data.date_ordre;

    //numparc
    this.ordre.diagnostic.demande.vehicule.numparc = data.numparc;
    this.ordre.diagnostic.description_panne = data.description_panne;
    this.ordre.diagnostic.causes_panne = data.causes_panne;
    this.ordre.diagnostic.actions = data.actions;
    this.ordre.diagnostic.date_diagnostic = data.date_diagnostic;
    this.ordre.diagnostic.heure_diagnostic = data.heure_diagnostic;

    //atelier
    this.ordre.atelier.nom_atelier = data.nom_atelier;
    this.ordre.atelier.telephone = data.telephone;
    this.ordre.atelier.email = data.email;
    this.ordre.atelier.capacite = data.capacite;

    //technicien
    this.ordre.technicien.id_technicien = data.id_technicien;
    this.ordre.technicien.nom = data.nom;
    this.ordre.technicien.prenom = data.prenom;
    this.ordre.technicien.matricule_techn = data.matricule_techn;
    this.ordre.technicien.telephone_techn = data.telephone_techn;
    this.ordre.technicien.email_techn = data.email_techn;
    this.ordre.technicien.specialite = data.specialite;

  }



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
      heure_diagnostic: '',
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
  diagnostics: Diagnostic[] = [];
  techniciens: Technicien[] = [];
  ateliers: Atelier[] = [];
  travaux: Travaux[] = [];
  interventions: Intervention[] = [];

  intervention: Intervention = {
    id_intervention: 0,
    ordre: {
      id_ordre: 0,
      diagnostic: {
        id_diagnostic: 0,
        demande: {
          vehicule: { numparc: 0 }
        },
      },
      nom_travail: '',
      urgence_panne: '',
      //travaux: { id_travaux: 0, nom_travail: '', type_atelier: '' },
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
    },
    technicien: {
      id_technicien: 0,
      nom: '',
      prenom: '',
      matricule_techn: this.matricule_techn,
      email_techn: '',
      specialite: '',
    },
    date_debut: '',
    heure_debut: '',
    date_fin: '',
    heure_fin: '',
    status_intervention: '',
    commentaire: '',
    atelier: {
      nom_atelier: '',
      telephone: '',
      email: ''
    }
  }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  getStatusClass(status_intervention: string): string {
    switch (status_intervention) {
      case 'Planifier':
        return 'status-planifier';
      case 'Terminer':
        return 'status-terminer';
      case 'En cours':
        return 'status-en-cours';
      case 'Annuler':
        return 'status-annuler';
      default:
        return '';
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  /*ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id_ordre'];
      if (id) {
        this.loadOrdreById(id);
        this.loadInterventionById(id);
      }
    });
  }*/

  ngOnInit(): void {
    if (this.data?.id_ordre) {
      this.ordre.id_ordre = this.data.id_ordre;
      this.loadOrdreById(this.data.id_ordre);
      this.loadInterventionById(this.ordre.id_ordre);
    }

    this.loadOrdre();

  }

  loadOrdreById(id_ordre: number) {
    this.consultService.getDetailsOrder(id_ordre).subscribe({
      next: (data) => {
        this.ordres = data;
        this.cd.detectChanges();

      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’ordre', err);
      }
    });
  }


  loadInterventionById(id_ordre: number): void {
    this.consultService.getInterventionByOrder(id_ordre).subscribe((data) => {
      console.log('Données récupérées : ', data);

      this.dataSource.data = data;

      /*this.interventions = data;
      this.dataSource.data = this.interventions;

      this.cd.detectChanges();

      this.dataSource = new MatTableDataSource<Intervention>(this.interventions);*/

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving Intervention: ', error);
    }
    );

  }

  loadOrdre(): void {
    this.ordreService.fetchAllOrders().subscribe(
      (data) => {
        this.ordres = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.snackBar.open('Error fetching orders, please try again later.', 'Close', { duration: 5000 });
      }
    );
  }


  interventionOrdre(ordre: any) {
    //this.ngxService.start();
    const dialogRef = this.dialog.open(AddInterventionComponent, {
      width: '600px',
      height: '600px',
      data: { ...ordre, ...ordre.technicien, ...ordre.atelier, ...ordre.travaux }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interventionService.createIntervention(result).subscribe(() => {
          console.log("Intervention added successfully!");
          this.snackBar.open("Intervention added successfully!", "Close", { duration: 5000 });
          this.loadInterventionById(this.ordre.id_ordre);

        },
          (error) => {
            console.log(error);
          });
      }
    })
  }


  editIntervention(intervention: Intervention) {
    const dialogRef = this.dialog.open(AddInterventionComponent, {
      width: '600px',
      height: '600px',
      data: { ...intervention }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.interventionService.updateIntervention(intervention.id_intervention, result).subscribe(
          () => {
            console.log("Intervention updated!", result);
            this.snackBar.open("Intervention updated successfully", 'close', { duration: 6000 });
            this.loadInterventionById(this.ordre.id_ordre);
          }, (error) => {
            console.error('Error while updating Intervention', error);
          }
        );
      }
    });
  }

  deleteIntervention(id_intervention: Number) {

    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.interventionService.deleteIntervention(id_intervention).subscribe(() => {
        this.interventions = this.interventions.filter(item => item.id_intervention !== id_intervention);
        this.snackBar.open('Intervention deleted successfully!', 'Close', { duration: 6000 });

        //window.location.reload();
      }, (error) => {
        console.error("Error while deleting Intervention:", error);

      }
      );
    }
  }

  //exprt to pdf
  generatePdf(id_intervention: number) {
    this.interventionService.generatePdfIntervention(id_intervention).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob); //Création d'un objet URL pour le blob :
      const a = document.createElement('a'); //Crée un élément <a> de manière dynamique.
      a.href = url; //Définit l'URL du fichier PDF pour le lien.
      a.download = 'document.pdf'; //nom du fichier télécharger
      a.click(); //Simule un clic sur le lien, ce qui lance le téléchargement du fichier.
      window.URL.revokeObjectURL(url); // libérer la mémoire
    })
  }

}
