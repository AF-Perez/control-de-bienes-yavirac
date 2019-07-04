import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(private  router:  Router, private  authService:  AuthService,) { }

  ngOnInit() {

  }

  register(formulario) {
    this.authService.registrar(formulario.value).subscribe((res) => {
      this.router.navigateByUrl('usuarios');
    });
  }

}
