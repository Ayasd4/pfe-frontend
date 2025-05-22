import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddVehiculeComponent } from '../add-vehicule/add-vehicule.component';
import { Vehicule } from '../vehicule';
import { VehiculeService } from '../vehicule.service';

@Component({
  selector: 'app-vehicule',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './vehicule.component.html',
  styleUrls: ['./vehicule.component.css']
})
export class VehiculeComponent implements OnInit {
  numparc: any = undefined;
  annee: any = undefined;

  displayedColumns: string[] = ['idvehicule', 'numparc', 'immatricule', 'modele', 'annee', 'etat', 'actions'];
  dataSource = new MatTableDataSource<Vehicule>();

  constructor(private vehiculeService: VehiculeService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  //@ViewChild() permet d’accéder à l'élément <p> du template.
  @ViewChild(MatSort) sort: any;
  @ViewChild(MatPaginator) paginator: any;


  vehicule: Vehicule = {
    idvehicule: 0,
    numparc: this.numparc,
    immatricule: '',
    modele: '',
    annee: this.annee,
    etat: ''
  }

  //vehicules est une propriété de la classe qui contient un tableau d'objets de type Vehicule.
  vehicules: Vehicule[] = [];
  filteredVehicules: Vehicule[] = [];

  ngOnInit(): void {
    this.loadVehicules();
  }
  //ngAfterViewInit() modifie le texte du paragraphe une fois que la vue est complètement rendue.
  loadVehicules(): void {
    this.vehiculeService.fetchAllVehicules().subscribe((data) => {

      //const hiddenIds = JSON.parse(localStorage.getItem('hiddenVehicules') || '[]');

      // Ne pas inclure les ateliers supprimés dans la liste des ateliers visibles
      //const visibleVehicules = data.filter(vehicule => !hiddenIds.includes(vehicule.idvehicule));

      this.vehicules = data;
      this.dataSource = new MatTableDataSource<Vehicule>(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.error('Error while recovery vehicle :', error);
    }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddVehiculeComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehiculeService.createVehicule(result).subscribe(
          () => {
            console.log('New Vehicle created successfully!');
            window.location.reload(); // Recharger la liste après ajout
          },
          (error) => {
            console.log(error);
            window.location.reload();
          }
        );
      }
    });
  }

  editVehicule(vehicule: Vehicule) {
    const dialogRef = this.dialog.open(AddVehiculeComponent, {
      width: '400px',
      data: { ...vehicule } // Passer les données du véhicule
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehiculeService.updateVehicule(result).subscribe(
          () => {
            console.log("Vehicle updated!");
            this.snackBar.open('Vehicle updated successfully!', 'Close', { duration: 6000 });
            window.location.reload(); // Rafraîchir après mise à jour
          },
          (error) => {
            console.error("Error while updated vehicle :", error);
          }
        );
      }
    });
  }

  searchVehicule(input: any) {
    this.filteredVehicules = this.vehicules.filter(item => item.numparc.toString().includes(input)
      || item.immatricule.toLowerCase().includes(input.toLowerCase())
      || item.modele.toLowerCase().includes(input.toLowerCase())
      || item.annee.toString().includes(input)
      || item.etat.toLowerCase().includes(input.toLowerCase()))
    this.dataSource = new MatTableDataSource<Vehicule>(this.filteredVehicules);
  }

  deleteVehicule(idvehicule: Number) {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      this.vehiculeService.deleteVehicule(idvehicule).subscribe((data) => {
        this.vehicules = this.vehicules.filter(item => item.idvehicule !== idvehicule);
        this.snackBar.open('Vehicle updated successfully!', 'Close', { duration: 6000 });
        window.location.reload();
      }, (error) => {
        console.error("Error while deleted vehicle :", error);
      }
      );
    }

  }
}














/*if (isConfirmed) {
      // Ajouter l'ID de l'atelier supprimé dans le localStorage
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenVehicules') || '[]');
      if (!hiddenIds.includes(idvehicule)) {
        hiddenIds.push(idvehicule);
        localStorage.setItem('hiddenVehicules', JSON.stringify(hiddenIds));
      }

      // Supprimer l'atelier de la liste locale (interface)
      this.vehicules = this.vehicules.filter(item => item.idvehicule !== idvehicule);
      this.dataSource.data = this.vehicules;

      // Afficher un message de confirmation
      this.snackBar.open('Vehicle removed!', 'Close', { duration: 5000 });
    }*/
