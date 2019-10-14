import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contar-bien',
  templateUrl: './contar-bienes.page.html',
  styleUrls: ['./contar-bienes.page.scss'],
})
export class ContarBienesPage implements OnInit {

  // variables
  ubicacion: any;
  fecha: any;
  bienes: any = [];
  conteos: any = [];
  bien: any;
  contadorBien: number;
    
  @ViewChild('bienSelector') bienSelector: IonicSelectableComponent;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private servicioBienes: BienesService,
    public alertController: AlertController,
    private location: Location,

  ) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // llenar la variable
        this.ubicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
      }
    });
  }


  // cuando se genere la pagina
  ngOnInit() {
    this.obtenerFechaActual();    
    this.obtenerBienes();
    this.contadorBien = 0;
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

  bienChange(event: {
    component: IonicSelectableComponent,
    value: any,
  }) {
    // console.log('bien:', event.value);
    // event.value = {...event.value, numero: 3};
    // this.conteos = [...this.conteos, event.value];
    
  }

  onCloseSelect(event: {component: IonicSelectableComponent}) {
    // event.component.clear();
  }

  agregarItem() {

    if (this.bien == null || this.contadorBien <= 0) return;

    let nuevoItem = {bien: this.bien, cantidad: this.contadorBien}
    
    this.conteos = [...this.conteos, nuevoItem];
    
    // eliminar bien ya seleccionado
    let idBien = this.bien.id;
    this.bienes = this.bienes.filter(function(bien) {
      return bien.id != idBien;
    });

    console.log(this.bienes);

    // limpiar campos
    this.bienSelector.clear();
    this.contadorBien = 0;
  }

  ingresarConteo() {
    alert('Conteo ingresado');
    this.location.back();
  }

  cancelarConteo() {
     this.location.back();
  }

}
