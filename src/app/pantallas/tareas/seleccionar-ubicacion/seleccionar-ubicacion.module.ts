import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SeleccionarUbicacionPage } from './seleccionar-ubicacion.page';

const routes: Routes = [
  {
    path: '',
    component: SeleccionarUbicacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SeleccionarUbicacionPage]
})
export class SeleccionarUbicacionPageModule {}
