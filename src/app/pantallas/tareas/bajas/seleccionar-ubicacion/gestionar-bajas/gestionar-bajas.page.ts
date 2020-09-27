import { TareasService } from './../../../../../services/tareas.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalBajarPage } from './modal-bajas.page';


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
        console.log(bienes);
        this.bienes = bienes;
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
    return await modal.present();
  }
  
}


