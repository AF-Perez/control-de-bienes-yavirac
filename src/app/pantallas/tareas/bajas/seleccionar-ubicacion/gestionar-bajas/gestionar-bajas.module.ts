import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionarBajasPage } from './gestionar-bajas.page';

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
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    GestionarBajasPage,
  ],
})

export class GestionarBajasPageModule {}
