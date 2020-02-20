import { TestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PasswordValidator } from '../../validadores/password.validador';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  constructor(
    // servicio para autenticarse
    private authService: AuthService,
    // para navegar entre pantallas
    private router: Router,
    // validaciones
    public formBuilder: FormBuilder,
    // para mostrar alertas
    private alertCtrl: AlertController,
    // para spinner controller
    private loadingCtrl: LoadingController,
  ) { }

  // variables de clase
  validationsForm: FormGroup;

  cargando = false;

  validationMessages = {
    email: [
      { type: 'required', mensaje: 'Email es requerido.' },
      { type: 'pattern', mensaje: 'por favor ingrese un E-mail valido.' }
    ],
    password: [
      { type: 'required', message: 'La contraseña es requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener como minimo 5 caracteres' },
      { type: 'pattern', message: 'Su contraseña debe contener al menos una mayúscula, una minúscula y un número.' }
    ],
    confirm_password: [
      { type: 'required', message: 'La confirmación de su contWSraseña es requerida' }
    ],
    matching_passwords: [
      { type: 'areEqual', message: 'Contraseñas no coincide' }
    ],
  };

  ngOnInit() {

    this.validationsForm = this.formBuilder.group({
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
  onLogin(formulario) {
    this.cargando = true;
    // estableciendo el loading controller
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Ingresando...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.authService.logear(formulario.email, formulario.password).subscribe(
        (resp) => {
          this.cargando = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('caratula');
        },
        (error) => {
          console.error(error.status);
          let mensajeError = 'Error desconocido';
          if (error.status == '401') {
            mensajeError = 'El usuario no se encuentra registrado';
          } else {
            mensajeError = error.message;
          }
          this.cargando = false;
          loadingEl.dismiss();
          this.mostrarAlert(mensajeError);
        });
      });
  }

  // nos muestra un alerta al momento de ingresar
  private mostrarAlert(message) {
    this.alertCtrl.create({
      header: 'Autenticación fallida',
      message: message,
      buttons: ['Ok']
    }).then(alertEl => alertEl.present());
  }

}
