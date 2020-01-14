import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage';
import { AuthModule } from  './auth/auth.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor'
import { IonicSelectableModule } from 'ionic-selectable';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AuthModule,
    FormsModule,
    CommonModule,
    IonicSelectableModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    SQLite,
    BarcodeScanner,
    Network,
    SQLitePorter,
    Camera,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
