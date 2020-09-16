import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { TareasService } from './../../../services/tareas.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-seleccionar-ubicacion',
  templateUrl: './seleccionar-ubicacion.page.html',
  styleUrls: ['./seleccionar-ubicacion.page.scss'],
})
export class SeleccionarUbicacionPage implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private servicioTareas: TareasService,
  ){
  }

  // todas estas variables estan accesibles en el html
  ubicaciones: any = [];
  tipoTarea = 'REGISTRO';
  private ubicacionesSub: Subscription;
  tareas: any = [];

  // este metode se va a llamar una vez que se termine de cargar la pantalla
  ngOnInit() {
    this.obtenerUbicaciones();
    this.obtenerTareas();
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
    return this.servicioTareas.obtenerUbicacionesPorTarea(this.tipoTarea).pipe(take(1)).subscribe(ubicaciones => {
      this.ubicaciones = ubicaciones;
    });
  }

  obtenerTareas() {
    return this.servicioTareas.obtenerTareasUsuario(this.tipoTarea).subscribe(tareas => {
      this.tareas = tareas;
      console.log('tareas', this.tareas);
    });
  }

  ngOnDestroy() {
    console.log('seleccionar-ubicacion destroyed');
    if (this.ubicacionesSub) {
      this.ubicacionesSub.unsubscribe();
    }
  }
}
