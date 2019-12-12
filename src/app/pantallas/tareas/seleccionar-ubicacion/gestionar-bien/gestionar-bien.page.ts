import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TareaRegistroService } from 'src/app/services/tarea-registro.service';
import { Subscription } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import {Location} from '@angular/common';

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
    if (this.bienesSubscripcion) {
      this.bienesSubscripcion.unsubscribe();
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
        this.servicioRegistro.guardarBienes(this.bienes)
          .subscribe(bien => {
            // acciones luego de guardar
            loadingEl.dismiss();
            this._location.back();
          });
      })
  }

}
