import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

import { ContarBienesPage } from './contar-bienes.page';
import { ModalConteoPage } from './modal-conteo.page';

const routes: Routes = [
  {
    path: '',
    component: ContarBienesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
  ],
  declarations: [
    ContarBienesPage,
    ModalConteoPage,
  ]
})
export class ContarBienesPageModule {}
