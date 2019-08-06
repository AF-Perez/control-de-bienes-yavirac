import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'usuarios', loadChildren: './recetas/recetas.module#RecetasPageModule' },
  { path: 'registrar', loadChildren: './auth/registrar/registrar.module#RegistrarPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  // { path: 'caratula', loadChildren: './caratula/caratula.module#CaratulaPageModule' },
  { path: 'caratula',
    children: [
      {
        path: '',
        loadChildren: './caratula/caratula.module#CaratulaPageModule',
      }
      ,
      {
        path: ':idUsuario',
        loadChildren: './detalle/detalle.module#DetallePageModule'
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
