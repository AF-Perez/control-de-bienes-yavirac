import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from "@angular/router";
import { TareasService } from './../../services/tareas.service';
import { OfflineService } from './../../services/offline.service';
import { Subscription, timer } from 'rxjs';
import { DatabaseService } from './../../services/database.service';
import { SincronizacionService } from 'src/app/services/sincronizacion.service';
import { take } from 'rxjs/operators';

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
  preguntadorTimer = null;
  timerSub: Subscription;
  registrosNum: number = 0;
  conteosNum: number = 0;
  bajasNum: number = 0;
  hayConteos = false;
  private tareasIcompSubs: Subscription;

  ngOnInit() {
    // this.conexionSubscripcion = this.offlineService.tieneConexion.subscribe(resultado => {
    //   this.tieneConexion = resultado;
    // });

    // this.preguntadorTimer = setInterval(() => {
    //   this.offlineService.comprobarConexion();
    // }, 10000);

    this.subscripcionBase = this.db.getDatabaseState().subscribe(levantadoDB => {
      if (levantadoDB) {
        console.log(levantadoDB);
        // si la base se levanto correctamente se procede a sincronizar la base local con el servidor
        this.servicioSync.sincronizarApp().subscribe(res => {
          console.log('resultado sincr');
        });
      }
    });

    // consultar el numero de tareas pendientes por cada tipo
    this.tareasService.cargarTareasIncompletas().subscribe(tareas => {
      // this.updateIncomplete(tareas);
    });

    this.tareasIcompSubs = this.tareasService.tareasIncompletas.subscribe(ti => {
      this.updateIncomplete(ti);
    });
  }

  ngOnDestroy() {
    if (this.conexionSubscripcion) {
      this.conexionSubscripcion.unsubscribe();
    }
    if (this.subscripcionBase) {
      this.subscripcionBase.unsubscribe();
    }
    if (this.tareasIcompSubs) {
      this.tareasIcompSubs.unsubscribe();
    }
    // clearInterval(this.preguntadorTimer);
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
    this.tareasService.obtenerTareasIncompletas()
      .subscribe(tareas => {
        console.log(tareas);
        this.tareas = tareas;
      });
  }

  doRefresh(event) {
    this.resetCounters();
    this.tareasService.obtenerTareasIncompletas().subscribe(tareas => {
      this.updateIncomplete(tareas);
      if (event) {
        event.target.complete();
      }
    });
  }

  updateIncomplete(tareasIncompletas) {
    this.resetCounters();
    tareasIncompletas.forEach(tarea => {
      switch (tarea.tipo) {
        case 'REGISTRO':
          this.registrosNum++;
          break;
        case 'CONTEO':
          this.conteosNum++;
          break;
        case 'BAJAS':
          this.bajasNum++;
          break;
        default:
          break;
      }
    });
  }

  resetCounters() {
    this.registrosNum = 0;
    this.conteosNum = 0;
    this.bajasNum = 0;
  }
}
