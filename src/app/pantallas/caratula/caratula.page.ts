import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { Router } from "@angular/router";
import { UsuariosService } from '../../servicios/usuarios.service';


@Component({
  selector: 'app-caratula',
  templateUrl: './caratula.page.html',
  styleUrls: ['./caratula.page.scss'],
})
export class CaratulaPage implements OnInit {

  constructor(
    private menu: MenuController,
    private  authService: AuthService,
    private  router: Router,
    public servicioUsuario: UsuariosService,
    ) { }

    usuarios: any[] = [];

  ngOnInit() {
    this.servicioUsuario.obtenerUsuarios()
    .subscribe(
      (respuesta) => { 
        // exito
        console.log(respuesta);
        this.usuarios = respuesta["results"];
      },
      (error) =>{ 
        // error
        console.log(error)
      }
    )
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  
  salir() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
