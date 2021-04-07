import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { BienesService } from '../../../../../servicios/bienes.service';
import { TareasService } from '../../../../../services/tareas.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ModalConteoPage } from './modal-conteo.page';
import { Subscription } from 'rxjs';


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
  idAsignacion: any;
  idUbicacion: any;
  private conteosSub: Subscription;

  @ViewChild('bienSelector') bienSelector: IonicSelectableComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioBienes: BienesService,
    private servicioTareas: TareasService,
    public alertController: AlertController,
    private location: Location,
    private loadingCtrl: LoadingController,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    private tareasService: TareasService,
    private platform: Platform,
    private modalController: ModalController,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.idUbicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
        this.idAsignacion = this.router.getCurrentNavigation().extras.state.idAsignacion;
      }
    });
    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   console.log('Handler was called!');
    // });
  }


  // cuando se genere la pagina
  ngOnInit() {
    this.obtenerFechaActual();
    this.contadorBien = 0;
    this.tareasService.conteosTarea.subscribe(conteos => {
      this.conteos = conteos;
    });
  }

  obtenerBienes() {
    this.servicioBienes.traerBienes()
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

  onCloseSelect(event: { component: IonicSelectableComponent }) {
    // event.component.clear();
  }

  agregarItem() {
    if (this.bien == null || this.contadorBien <= 0) return;
    let nuevoItem = { bien: this.bien, cantidad: this.contadorBien }
    this.conteos = [...this.conteos, nuevoItem];

    // eliminar bien seleccionado
    let idBien = this.bien.id;
    this.bienes = this.bienes.filter(function (bien) {
      return bien.id != idBien;
    });

    // limpiar campos
    this.bienSelector.clear();
    this.contadorBien = 0;
  }

  ingresarConteobkp() {
    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        console.log('this.conteos :>> ', this.conteos);
        this.servicioTareas.ingresarConteos(this.conteos, this.idAsignacion)
          .subscribe(response => {
              this.tareasService.removerTarea(this.idAsignacion);
              this.tareasService.vaciarConteos();
              loadingEl.dismiss();
              this.location.back();
          });
      })
  }

  ingresarConteo() {
    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.servicioTareas.ingresarConteos(this.conteos, this.idAsignacion)
          .subscribe(response => {
            // console.log('response :>> ', response);
            if (response['resultado'] == 1) {
              this.tareasService.removerTarea(this.idAsignacion);
              this.tareasService.vaciarConteos();
              loadingEl.dismiss();
              this.location.back();
            } else {
              loadingEl.dismiss();
              this.toastController.create({
                message: 'Los datos ingresados no concuerdan con los de nuestra base.',
                duration: 3000,
              }).then(toastEl => {
                toastEl.present();
              });
            }
          });
      })
  }

  async cancelarConteo() {
    const alert = await this.alertController.create({
      header: 'Se perderán sus cambios. ¿Esta seguro?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.tareasService.vaciarConteos();
            this.location.back();
          }
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  abrirScaner() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.conteos = [...this.conteos, { codigo: barcodeData.text }];
      console.log(this.conteos);
      // limpiar campos
      this.bienSelector.clear();
      this.contadorBien = 0;
    }).catch(err => {
      console.log('Error', err);
    });
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: ModalConteoPage,
      componentProps: {
        idAsignacion: this.idAsignacion,
      },
    });

    modal.onDidDismiss()
      .then((data) => {

      });

    return await modal.present();
  }

  quitarConteo(codigoBien) {
    this.servicioTareas.removerConteo(codigoBien);
  }

}
