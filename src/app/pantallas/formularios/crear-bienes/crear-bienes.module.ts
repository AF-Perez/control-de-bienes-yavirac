import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CrearBienesPage } from './crear-bienes.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

const routes: Routes = [
  {
    path: '',
    component: CrearBienesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
  ],
  providers: [
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  declarations: [CrearBienesPage]
})
export class CrearBienesPageModule {}
