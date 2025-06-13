import { CommonModule } from "@angular/common";
import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Demande } from "../demande";
import { DemandeService } from "../demande.service";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { AddDemandeComponent } from "../add-demande/add-demande.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Chauffeur } from "src/app/chauffeur/chauffeur";
import { Vehicule } from "src/app/vehicule/vehicule";
import { VehiculeService } from "src/app/vehicule/vehicule.service";
import { ChauffeurService } from "src/app/chauffeur/chauffeur.service";
import { PdfService } from "../pdf.service";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule
  ]
})
export class DemandeComponent implements OnInit {

  displayedColumns: string[] = ['id_demande', 'date_demande', 'type_avarie', 'description', 'date_avarie', 'statut', 'vehicule', 'driver', 'actions'];
  dataSource = new MatTableDataSource<Demande>();
  numparc: any = undefined;

  constructor(private demandeService: DemandeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private vehiculeService: VehiculeService,
    private chauffeurService: ChauffeurService,
    private pdfService: PdfService
  ) { }

  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;

  demande: Demande = {
    id_demande: 0,
    date_demande: '',
    type_avarie: '',
    description: '',
    date_avarie: '',
    heure_avarie: '',
    statut: '',
    vehicule: {
      idvehicule: 0,
      numparc: this.numparc,
      immatricule: '',
      modele: '',
      annee: 0,
      etat: ''
    },
    chauffeur: {
      id_chauf: 0,
      nom: '',
      prenom: '',
      matricule_chauf: '',
      cin: '',
      telephone: '',
      email: '',
      image: ''
    }

  }

  vehicules: Vehicule[] = [];
  chauffeurs: Chauffeur[] = [];
  demandes: Demande[] = [];
  filteredDemandes: Demande[] = [];

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'En attente':
        return 'statut-en-attente';
      case 'En cours de traitement':
        return 'statut-en-cours';
      case 'Accepter':
        return 'statut-accepte';
      case 'Refuser':
        return 'statut-refuse';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    this.loadRequest();
  }

  loadRequest(): void {
    this.demandeService.fetchAllDemandes().subscribe((data) => {
      console.log('Données récupérées : ', data);

      this.demandes = data;
      this.dataSource = new MatTableDataSource<Demande>(this.demandes);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.log('Error while retrieving request: ', error);
    });

    this.loadVehicules();
    this.loadChauffeurs();
  }

  loadDemandes(): void {
    this.demandeService.fetchAllDemandes().subscribe(
      (data) => {
        this.demandes = data;
        this.filteredDemandes = data;
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  loadVehicules(): void {
    this.vehiculeService.fetchAllVehicules().subscribe(
      (data) => {
        this.vehicules = data;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  // Load all drivers from the service
  loadChauffeurs(): void {
    this.chauffeurService.fetchAllChauffeurs().subscribe(
      (data) => {
        this.chauffeurs = data;
      },
      (error) => {
        console.error('Error fetching drivers:', error);
      }
    );
  }

  searchParams: any = {};

  searchDemandes(): void {
    const filteredParams = Object.fromEntries(
      Object.entries(this.searchParams).filter(([__dirname, value]) => value !== null && value !== undefined && value !== '')
    );

    if (Object.keys(filteredParams).length === 0) {
      this.loadDemandes();
      return;
    }

    this.demandeService.searchDemandes(filteredParams).subscribe((data) => {
      this.filteredDemandes = data;
      this.dataSource.data = data;
    },
      (error) => {
        console.error('Error searching requests:', error);
      }
    );
  }

  resetSearch(): void {
    this.searchParams = {};
    this.loadDemandes();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDemandeComponent, {
      width: '600px',
      height: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.demandeService.createDemande(result).subscribe(
          () => {
            console.log('new demand created successfully!');
            this.loadRequest();
          },
          (error) => {
            console.log(error);
            window.location.reload();
          });
      }
    });
  }


  editDemande(demande: Demande) {
    const dialogRef = this.dialog.open(AddDemandeComponent, {
      width: '600px',
      height: '600px',
      data: { ...demande }, //passer les données de demande
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.demandeService.updateDemande(result).subscribe(
          () => {
            console.log("request updated!", result);
            this.snackBar.open("request updated successfully", 'close', { duration: 9000 });
            this.loadRequest();
          }, (error) => {
            console.error('Error while updated request', error);
          }
        );
      }
    });
  }

  deleteDemande(id_demande: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.demandeService.deleteDemande(id_demande).subscribe(() => {
        this.demandes = this.demandes.filter(item => item.id_demande !== id_demande);
        this.snackBar.open('Request deleted successfully!', 'Close', { duration: 6000 });
        this.loadRequest();
      }, (error) => {
        console.error("Error while deleting Request:", error);

      });

    }
  }

  //exprt to pdf
  generatePdf(id_demande: number) {
    this.pdfService.generatePdf(id_demande).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob); //Création d'un objet URL pour le blob :
      const a = document.createElement('a'); //Crée un élément <a> de manière dynamique.
      a.href = url; //Définit l'URL du fichier PDF pour le lien.
      a.download = 'document.pdf'; //nom du fichier télécharger
      a.click(); //Simule un clic sur le lien, ce qui lance le téléchargement du fichier.
      window.URL.revokeObjectURL(url); // libérer la mémoire
    })
  }

}