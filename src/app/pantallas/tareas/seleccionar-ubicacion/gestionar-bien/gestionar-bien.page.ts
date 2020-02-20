import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaRegistroService } from 'src/app/services/tarea-registro.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import {Location} from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-gestionar-bien',
  templateUrl: './gestionar-bien.page.html',
  styleUrls: ['./gestionar-bien.page.scss'],
})
export class GestionarBienPage implements OnInit, OnDestroy {

  // variables
  ubicacion: any;
  fecha: any;
  bienes: any = [];
  private bienesSubscripcion: Subscription;
  private guardarBienesSub: Subscription;
  bienesEstaVacio: boolean = true;
  horaFechaInicio: number;
  horaFechaFin: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioRegistro: TareaRegistroService,
    private loadingCtrl: LoadingController,
    private _location: Location,
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
    this.resetearHoraFecha();
    this.iniciarTimer();
    this.bienesSubscripcion = this.servicioRegistro.bienes.subscribe(bienes => {
      this.bienes = bienes;
    });
  }

  ngOnDestroy() {
    console.log('gestionar-bien destroyed');
    if (this.bienesSubscripcion) {
      this.bienesSubscripcion.unsubscribe();
    }
    if (this.guardarBienesSub) {
      this.guardarBienesSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.bienesEstaVacio = this.bienes.length === 0 ? true : false;
    this.iniciarTimer();
  }

  resetearHoraFecha() {
    this.horaFechaInicio = Date.now();
    this.horaFechaFin = 0;
  }

  iniciarTimer() {
    setInterval(() => {
      this.horaFechaFin = Date.now() - this.horaFechaInicio;
    }, 1000);
  }

  onSubmit() {
    if (this.bienes === null) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        console.log(this.bienes);
        this.guardarBienesSub = this.servicioRegistro.guardarBienes(this.bienes)
          .subscribe(() => {
            // acciones luego de guardar
            loadingEl.dismiss();
            this._location.back();
          });
      })
  }

  quitar(bien) {
    this.servicioRegistro.removerBien(bien.codigo).subscribe(res => {
      // TODO
    });
  }

}
