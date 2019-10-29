import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../servicios/bienes.service';

@Component({
  selector: 'app-gestionar-bien',
  templateUrl: './gestionar-bien.page.html',
  styleUrls: ['./gestionar-bien.page.scss'],
})
export class GestionarBienPage implements OnInit {

  // variables
  ubicacion: any;
  fecha: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private servicioBienes: BienesService,
  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // llenar la variable
        this.ubicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
      }
    });
  }

  bienes: any = [];

  // cuando se genere la pagina
  ngOnInit() {
    this.obtenerFechaActual();    
    this.obtenerBienes();
  }

  ionViewWillEnter() {
    // this.obtenerFechaActual();    
    this.obtenerBienes();
  }

  obtenerBienes() {
    this.servicioBienes.traerBienesDeUbicacion(this.ubicacion.id)
      .subscribe(bienes => {
        this.bienes = bienes;
      });
  }

  obtenerFechaActual() {
    this.fecha = new Date();
  }

  irACreacionDeBienes() {
    
  }
}
