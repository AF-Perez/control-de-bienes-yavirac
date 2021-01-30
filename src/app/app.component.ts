import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfflineService } from './services/offline.service';
import { SincronizacionService } from './services/sincronizacion.service';
import { take } from 'rxjs/operators';
import { NetworkService, ConnectionStatus } from './services/network.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private prevAuthState = false;
  private isOnline = false;
  private offlineSub: Subscription;
  private offlineSub2: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private servicioOffline: OfflineService,
    private servicioSync: SincronizacionService,
    public loadingController: LoadingController,
    private offlineManager: OfflineService,
    private networkService: NetworkService,

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status == ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });
    });
  }

  ngOnInit() {
    // se verifica si el usuario esta autentificado y se le reenvia al login si no esta
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuthenticated => {
      // prevAuthState ???
      if (!isAuthenticated && this.prevAuthState !== isAuthenticated) {
        this.router.navigateByUrl('/login');
      }
      this.prevAuthState = isAuthenticated;
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  // sincronizar() {
  //   this.loadingController
  //     .create({
  //       spinner: null,
  //       duration: 5000,
  //       message: 'Sincronizando...',
  //       translucent: true,
  //       cssClass: 'custom-class custom-loading'
  //     })
  //     .then(loadingElem => {
  //       loadingElem.present();
  //       this.offlineSub2 = this.servicioOffline.tieneConexion.subscribe(tieneCon => {
  //         if (tieneCon) {
  //           this.servicioSync.sincronizarBienesPendientes().subscribe(res => {
  //             loadingElem.dismiss();
  //           });
  //         } else {
  //           this.isOnline = false;
  //           loadingElem.dismiss();
  //         }
  //       });
  //     });
  // }

}
