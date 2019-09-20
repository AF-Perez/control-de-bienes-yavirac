import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearBienesPage } from './crear-bienes.page';

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
    RouterModule.forChild(routes)
  ],
  declarations: [CrearBienesPage]
})
export class CrearBienesPageModule {}
