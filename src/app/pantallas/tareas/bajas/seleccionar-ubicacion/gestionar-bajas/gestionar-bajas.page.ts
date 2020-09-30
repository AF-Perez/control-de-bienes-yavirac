import { TareasService } from './../../../../../services/tareas.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalBajarPage } from './modal-bajas.page';
import {Location} from '@angular/common';

@Component({
  selector: 'app-gestionar-bajas',
  templateUrl: './gestionar-bajas.page.html',
  styleUrls: ['./gestionar-bajas.page.scss'],
})
export class GestionarBajasPage implements OnInit {


  ubicacion: any;
  fecha: any;
  observaciones: any;
  bienes: any = [];
  idAsignacion: any;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private servicioBienes: BienesService,
    private servicioTareas: TareasService,
    public alertController: AlertController,
    private modalController: ModalController,
    private tareasService: TareasService,
    private _location: Location,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // llenar la variable
        this.ubicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
        this.idAsignacion = this.router.getCurrentNavigation().extras.state.idAsignacion;
      }
    });
   }

  ngOnInit() {
    this.obtenerFechaActual();    
    this.obtenerBienes()
  }

  obtenerBienes() {
    this.servicioBienes.traerBienesDeUbicacion(this.ubicacion)
      .subscribe(bienes => {
        this.bienes = bienes.filter(bien => {
          return bien.is_baja !== 1;
        });
        // this.bienes = bienes;
      });
  }

  obtenerFechaActual() {
    this.fecha = new Date();
  }

  async mostrarAlertObservacion(idBien) {
    const alert = await this.alertController.create({
      header: 'Motivo de Baja',
      inputs: [
        {
          name: 'observaciones',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (datos) => {
            // guardar los datos de baja
            this.servicioTareas.solicitarBajaBien(idBien, datos.observaciones).subscribe(respuesta => {
                let bien = this.bienes.filter(bien => bien.id === idBien);
                bien[0].enviado = true;
                // bloquear el elemento de la lista
            });          
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarModal(idBien) {
    const modal = await this.modalController.create({
      component: ModalBajarPage,
      componentProps: {
        idBien,
        idAsignacion: this.idAsignacion,
      },
    });

    modal.onDidDismiss()
      .then((data) => {
        this.bienes = this.bienes.filter(bien => {
          return bien.id !== data['data'].idDeleted;
        });
    });

    return await modal.present();
  }

  async finTarea(idTarea) {

    const alert = await this.alertController.create({
      header: '¿Terminar la tarea?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.servicioTareas.completarTarea(idTarea).subscribe(respuesta => {
              this.tareasService.removerTarea(this.idAsignacion);
              this._location.back();
            }); 
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
  
}


