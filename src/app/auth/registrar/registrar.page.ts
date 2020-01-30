import { Component, OnInit } from '@angular/core';
import { Router } from  "@angular/router";
import { AuthService } from '../auth.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  //crea un validador de tipo form_group 
  validators_form : FormGroup;

  constructor(
    
    private  router:  Router,
    private  authService:  AuthService,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,

     ) { }

  ngOnInit() {
    // grupo de validaciones
    this.validators_form = this.formBuilder.group({

      // validaciones
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // Validators.pattern('^[VE]-[0-9]{1,9}')
      ])),

      email: new FormControl('', Validators.compose([
        // campo obligatorio
        Validators.required,
        // tiene que tener forma de email
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),

      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),

    })
  }

  registrar(formulario) {
    // this.authService.registrar(formulario.value).subscribe((res) => {
    //   this.router.navigateByUrl('usuarios');
    // });
  }

  validation_messages = {
    'name': [
      { type: 'required', mensaje:'Nombre es requerido.' },
      { type: 'pattern', mensaje: 'Ingrese un nombre valido.' },
      { type: 'pattern', mensaje: 'El nombre debe tener maximo 5 caracteres.' },
    ],

    'email': [
      { type: 'required', mensaje: 'Email es requerido.' },
      { type: 'pattern', mensaje: 'por favor ingrese un E-mail valido.' }
    ],

    'confirm_password': [
      { type: 'required', message: 'La confirmación de su contraseña es requerida' }
    ],

    'matching_passwords': [
      { type: 'areEqual', message: 'Contraseñas no coincide.' }
    ],
  };
  

}
