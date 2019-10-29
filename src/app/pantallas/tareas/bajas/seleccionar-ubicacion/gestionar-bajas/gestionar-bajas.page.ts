import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../../servicios/bienes.service';
import { UbicacionesService } from '../../../../../servicios/ubicaciones.service';


@Component({
  selector: 'app-gestionar-bajas',
  templateUrl: './gestionar-bajas.page.html',
  styleUrls: ['./gestionar-bajas.page.scss'],
})
export class GestionarBajasPage implements OnInit {


  ubicacion: any;
  fecha: any;


  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private servicioBienes: BienesService,
    private ubicacionesService: UbicacionesService,

  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // llenar la variable
        this.ubicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
      }
    });
   }
   bienes: any = [];

  ngOnInit() {
    this.obtenerFechaActual();    
    this.obtenerBienes()
  }

  obtenerBienes() {
    this.servicioBienes.traerBienesDeUbicacion(this.ubicacion.id)
      .subscribe(bienes => {
        console.log(bienes);
        this.bienes = bienes;
      });
  }

  obtenerFechaActual() {
    this.fecha = new Date();
  }

  
  }


