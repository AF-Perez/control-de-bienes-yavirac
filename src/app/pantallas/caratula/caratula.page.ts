import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from "@angular/router";
import { TareasService } from './../../services/tareas.service';
import { OfflineService } from './../../services/offline.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from './../../services/database.service';
import { SincronizacionService } from 'src/app/services/sincronizacion.service';

@Component({
  selector: 'app-caratula',
  templateUrl: './caratula.page.html',
  styleUrls: ['./caratula.page.scss'],
})
export class CaratulaPage implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private router: Router,
    private tareasService: TareasService,
    private offlineService: OfflineService,
    private db: DatabaseService,
    private servicioSync: SincronizacionService,
    ) { }
    
  private subscripcionBase: Subscription;
  tareas: any = [];
  ubicaciones: any = [];
  tieneConexion = null;
  private conexionSubscripcion: Subscription;
  disconnectSubscription: any;
  connectSubscription: any;
  private preguntadorTimer = null;

  ngOnInit() {
    this.conexionSubscripcion = this.offlineService.tieneConexion.subscribe(resultado => {
      this.tieneConexion = resultado;
    });

    this.preguntadorTimer = setInterval(() => {
      this.offlineService.comprobarConexion();
    }, 10000);
    
    this.subscripcionBase = this.db.getDatabaseState().subscribe(levantadoDB => {
      if (levantadoDB) {
        this.servicioSync.sincronizarTareas().subscribe(tareas => {
          this.tareas = tareas;
        });
        this.servicioSync.sincronizarUbicaciones().subscribe(ubicaciones => {
          this.ubicaciones = ubicaciones;
        });
      }
    });

    // this.offlineService.tieneConexion.subscribe(tieneConx => {
    //   if (tieneConx) {
    //     this.obtenerTareas();
    //   } else {
    //     this.db.cargarTareas().then(res => {
    //       console.log(res);
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.conexionSubscripcion) {
      this.conexionSubscripcion.unsubscribe();
    }
    if (this.subscripcionBase) {
      this.subscripcionBase.unsubscribe();
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
