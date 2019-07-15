import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  authService:  AuthService, private  router:  Router) { }

  ngOnInit() {

  }

  login(formulario){
    //validacion
    let correo = formulario.value.email;
    let clave = formulario.value.password;
    
    console.log("su correo es = " + correo);
    console.log("su contraseña es = " + clave);
    // loguear
    this.authService.logear(formulario.value).subscribe((res)=>{
      this.router.navigateByUrl('usuarios');
    });
  }



}
