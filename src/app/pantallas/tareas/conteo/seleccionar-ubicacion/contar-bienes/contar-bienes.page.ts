import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { BienesService } from '../../../../../servicios/bienes.service';
import { TareasService } from '../../../../../services/tareas.service';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

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
    private servicioTareas: TareasService,
    public alertController: AlertController,
    private location: Location,
    private loadingCtrl: LoadingController,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner
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

    // limpiar campos
    this.bienSelector.clear();
    this.contadorBien = 0;
  }

  ingresarConteo() {
    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.servicioTareas.ingresarConteos(this.conteos)
          .subscribe(response => {
            // acciones luego de guardar
            var random_boolean = Math.random() >= 0.5;
            if (random_boolean) {
              loadingEl.dismiss();
              // this.validations_form.reset();
              this.toastController.create({
                message: 'Proceso completado con éxito.',
                duration: 2000
              }).then(toastEl => {
                toastEl.present();
              });
            } else {
              loadingEl.dismiss();
              this.toastController.create({
                message: 'Los datos no concuerdan con nuestra base.',
                duration: 2000
              }).then(toastEl => {
                toastEl.present();
              });
            }
            this.location.back();
          });
      })
      .catch(err => {
        this.toastController.create({
          message: 'Los datos no concuerdan con nuestra base.',
          duration: 2000
        }).then(toastEl => {
          toastEl.present();
        });
        this.location.back();
      })
  }

  cancelarConteo() {
     this.location.back();
  }

  abrirScaner() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.conteos = [...this.conteos,  {codigo: barcodeData.text}];
      console.log(this.conteos);
      // limpiar campos
      this.bienSelector.clear();
      this.contadorBien = 0;
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

}
