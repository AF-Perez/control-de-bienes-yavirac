import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registro', loadChildren: './auth/registrar/registrar.module#RegistrarPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  {
    path: 'caratula',
    loadChildren: './pantallas/caratula/caratula.module#CaratulaPageModule',
    canLoad: [AuthGuard],
  },
  { path: 'seleccionar-ubicacion', loadChildren: './pantallas/tareas/seleccionar-ubicacion/seleccionar-ubicacion.module#SeleccionarUbicacionPageModule' },
  { path: 'gestionar-bien', loadChildren: './pantallas/tareas/seleccionar-ubicacion/gestionar-bien/gestionar-bien.module#GestionarBienPageModule' },
  { path: 'crear-bienes/:idUbicacion', loadChildren: './pantallas/formularios/crear-bienes/crear-bienes.module#CrearBienesPageModule' },
  { path: 'contar-bienes', loadChildren: './pantallas/tareas/conteo/seleccionar-ubicacion/contar-bienes/contar-bienes.module#ContarBienesPageModule' },
  { path: 'conteo/seleccionar-ubicacion', loadChildren: './pantallas/tareas/conteo/seleccionar-ubicacion/seleccionar-ubicacion.module#SeleccionarUbicacionPageModule' },
  { path: 'gestionar-bajas', loadChildren: './pantallas/tareas/bajas/seleccionar-ubicacion/gestionar-bajas/gestionar-bajas.module#GestionarBajasPageModule' },
  { path: 'bajas/seleccionar-ubicacion', loadChildren: './pantallas/tareas/bajas/seleccionar-ubicacion/seleccionar-ubicacion.module#SeleccionarUbicacionPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
