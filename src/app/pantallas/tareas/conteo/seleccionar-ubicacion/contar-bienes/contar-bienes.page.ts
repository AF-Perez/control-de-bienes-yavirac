import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicSelectableComponent } from 'ionic-selectable';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private servicioBienes: BienesService,
    public alertController: AlertController,

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
    this.obtenerBienes()
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
    event.value = {...event.value, numero: 3};
    this.conteos = [...this.conteos, event.value];
    
  }

  onSelectBien(event: {
    component: IonicSelectableComponent,
    item: any,
    isSelected: boolean
  }) {
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Prompt!',
      inputs: [
        {
          name: 'contadorBien',
          type: 'number',
          min: -5,
          max: 10
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (values) => {
            console.log('Confirm Ok');
            console.log(values.contadorBien);
            this.conteos = values.contadorBien;
          }
        }
      ]
    });

    await alert.present();
  }
}
