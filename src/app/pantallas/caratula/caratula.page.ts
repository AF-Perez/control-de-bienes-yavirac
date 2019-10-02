import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';
import { Router } from "@angular/router";


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
    ) { }

  pages = [
    {
      title: 'Inicio',
      url: 'caratula',
      icon: 'home',
    },
    {
      title: 'Tareas',
      children: [
        {
          title: 'Registro de Bienes',
          url: '/menu/main',
          icon: 'home',
        },
        {
          title: 'Conteo',
          url: '/menu/main',
          icon: 'logo-ionic',
        },
        {
          title: 'Dar de baja',
          url: '/menu/main',
          icon: 'logo-google',
        },
      ],
    },
  ];

  ngOnInit() {
   
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
