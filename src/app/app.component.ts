import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OfflineService } from './services/offline.service';
import { SincronizacionService } from './services/sincronizacion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private prevAuthState = false;
  private isOnline = false;
  private offlineSub: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private servicioOffline: OfflineService,
    private servicioSync: SincronizacionService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuthenticated => {
      if (!isAuthenticated && this.prevAuthState !== isAuthenticated) {
        this.router.navigateByUrl('/login');
      }
      this.prevAuthState = isAuthenticated;
    });
    this.offlineSub = this.servicioOffline.tieneConexion.subscribe(tieneCon => {
      if (tieneCon) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });
  }

  ngOnDestroy() {
    console.warn('app.component destroyed');
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.offlineSub) {
      this.offlineSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  sincronizar() {
    console.log('sincronizando...');
    if (this.isOnline) {
      this.servicioSync.sincronizarApp().subscribe(res => {
        console.log('resultados sincronizacion boton');
        console.log(res);
      });
    }
  }
}
