import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarBajasPage } from './gestionar-bajas.page';
import { ModalBajarPage } from './modal-bajas.page';

// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


const routes: Routes = [
  {
    path: '',
    component: GestionarBajasPage
    
  }
  
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GestionarBajasPage,
    ModalBajarPage,
  ],
  entryComponents: [ModalBajarPage],
})

export class GestionarBajasPageModule {}
