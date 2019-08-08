import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from '../../validadores/password.validador';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variables de clase
  validations_form: FormGroup;

  constructor(
    // servicio para autenticarse
    private  authService:  AuthService, 
    // para navegar entre pantallas
    private  router:  Router,
    // validaciones
    public formBuilder: FormBuilder,
    // para mostrar alertas
    private alertCtrl: AlertController
  ) {

  }


  ngOnInit() {

    this.validations_form = this.formBuilder.group({
      // validacion para email
      email: new FormControl('', Validators.compose([
        // campo obligatorio
        Validators.required,
        // tiene que tener forma de email
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      // validacion para la contrasenia
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
    });
  }


  // loguear al usuario
  login(formulario){
    // nos permite enviar datos a la API
    this.authService.logear(formulario).subscribe((res)=>{
      this.router.navigateByUrl('caratula');
    });
    
    // muestra un mensaje de que se logueo con exito
    this.mostrarAlert();
  }

    //nos muestra un alerta al momento de ingresar  
  async mostrarAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Datos enviados!',
      subHeader: "Información",
      message: "Los registros fueron enviados correctamente",
      buttons: ['Ok']
    });
     await alert.present();
  }



  validation_messages = {
    'email': [
      { type: 'required', mensaje: 'Email es requerido.' },
      { type: 'pattern', mensaje: 'por favor ingrese un E-mail valido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener como minimo 5 caracteres' },
      { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'La confirmación de su contWSraseña es requerida' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Contraseñas no coincide' }
    ],
  };
  
  
}
