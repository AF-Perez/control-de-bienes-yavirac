import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { Router } from "@angular/router";
import { TareasService } from './../../services/tareas.service';
import { OfflineService } from './../../services/offline.service';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { DatabaseService } from './../../services/database.service';

@Component({
  selector: 'app-caratula',
  templateUrl: './caratula.page.html',
  styleUrls: ['./caratula.page.scss'],
})
export class CaratulaPage implements OnInit, OnDestroy {

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private router: Router,
    private tareasService: TareasService,
    private offlineService: OfflineService,
    private network: Network,
    private db: DatabaseService,
  ) { }
  
  tareas: any = [];
  tieneConexion = null;
  private conexionSubscripcion: Subscription;
  disconnectSubscription: any;
  connectSubscription: any;
  private preguntadorTimer = null;

  ngOnInit() {
    this.obtenerTareas();

    this.conexionSubscripcion = this.offlineService.tieneConexion.subscribe(resultado => {
      this.tieneConexion = resultado;
    });

    this.preguntadorTimer = setInterval(() => {
      this.offlineService.comprobarConexion();
    }, 10000);
   
  }

  ngOnDestroy() {
   
    if (this.conexionSubscripcion) {
      this.conexionSubscripcion.unsubscribe();
    }
    
    clearInterval(this.preguntadorTimer);
  }

  ionViewDidEnter() {
    // // watch network for a disconnection
    // this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    //   this.tieneConexion = false;
    // });

    // // watch network for a connection
    // this.connectSubscription = this.network.onConnect().subscribe(() => {
    //   this.tieneConexion = true;
    // });
  }

  salir() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

  obtenerTareas() {
    this.tareasService.obtenerTareas()
      .subscribe(tareas => {
        console.log(tareas);
        this.tareas = tareas;
      });
  }
}
