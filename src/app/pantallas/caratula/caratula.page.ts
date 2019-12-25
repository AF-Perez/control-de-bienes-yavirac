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
  isOnline = null;
  private conexionSubscripcion: Subscription;
  disconnectSubscription: any;
  connectSubscription: any;

  ngOnInit() {
    this.obtenerTareas();

    this.conexionSubscripcion = this.offlineService.tieneConexion.subscribe(resultado => {
      this.isOnline = resultado;
    });

    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.offlineService.comprobarConexion();
    });
    
    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.offlineService.comprobarConexion();
    });

    // inicializar la base de datos
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.addBien('123abc', 'MUEBLE', 1, 12.12, 'ninguna').then(() => {
          console.log('esqlito');
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.disconnectSubscription) {
      console.log('conectado');
      this.disconnectSubscription.unsubscribe();
    }

    if (this.connectSubscription) {
      console.log('desconectado');
      this.connectSubscription.unsubscribe();
    }

    if (this.conexionSubscripcion) {
      this.conexionSubscripcion.unsubscribe();
    }
  }

  ionViewDidEnter() {
    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.isOnline = false;
    });

    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      this.isOnline = true;
    });
  }

  comprobarConexion() {
    this.offlineService.comprobarConexion();
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
