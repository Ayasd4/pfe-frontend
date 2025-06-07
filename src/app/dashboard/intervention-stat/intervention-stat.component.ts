import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardService } from '../dashboard.service';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-intervention-stat',
  templateUrl: './intervention-stat.component.html',
  styleUrls: ['./intervention-stat.component.css'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    MatSnackBarModule
  ]
})
export class InterventionStatComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getTotalElectrique();
  }


  getTotalElectrique() {
    Promise.all([
      this.dashboardService.elecTotal().toPromise(),
      this.dashboardService.mecanTotal().toPromise(),
      this.dashboardService.volcTotal().toPromise(),
      this.dashboardService.moteurTotal().toPromise(),
      this.dashboardService.tolerieTotal().toPromise(),
      this.dashboardService.prevTotal().toPromise(),
    ])

      .then(([electrique, mecanique, volcanisation, moteur, tolerie, preventive]) => {
        const categories = [
          'Atelier Électrique',
          'Atelier Mécanique',
          'Atelier Volcanisation',
          'Atelier Moteur',
          'Atelier Tôlerie',
          'Atelier Préventive'
        ];

        const data = [
          +electrique?.[0]?.total_intervention || 0,
          +mecanique?.[0]?.total_intervention || 0,
          +volcanisation?.[0]?.total_intervention || 0,
          +moteur?.[0]?.total_intervention || 0,
          +tolerie?.[0]?.total_intervention || 0,
          +preventive?.[0]?.total_intervention || 0
        ];

        //graphique: bar chart
        this.chartOptions = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'les interventions par atelier'
          },
          xAxis: {
            categories: categories,
            title: { text: 'Ateliers' }
          },
          yAxis: {
            min: 0,
            title: { text: 'Nombre d’interventions' }
          },
          series: [{
            name: 'Interventions',
            type: 'column',
            data: data
          }]
        };
      })
      .catch(error => {
        console.error('Error while loading statistical data:', error);
      });
  }
}