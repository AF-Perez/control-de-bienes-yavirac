import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../services/tareas.service';
import { OfflineService } from './../../../services/offline.service';


@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit {

  constructor(
    private router: Router,
    private servicioTareas: TareasService,
    private servicioOffline: OfflineService,
  ){
  }

  // todas estas variables estan accesibles en el html
  ubicaciones: any = [];
  tipoTarea = 'REGISTRO';

  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {
    this.obtenerUbicaciones();
  }

  irAGestionarBienes(ubicacion){
    let navigationExtras: NavigationExtras = {
      state: {
        // aqui todo lo que se va a pasar a las sig pantalla
        user: 1,
        ubicacion: ubicacion,
      }
    };
    this.router.navigate(['gestionar-bien'], navigationExtras);
  }

  obtenerUbicaciones() {
    this.servicioTareas.obtenerUbicacionesPorTarea(this.tipoTarea).subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

  initDB() {
    this.servicioOffline.crearBaseDeDatos();
  }

}
