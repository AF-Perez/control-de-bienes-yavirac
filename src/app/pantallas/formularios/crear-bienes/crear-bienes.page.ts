import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UsernameValidator } from 'src/app/validadores/usuario.validador';

@Component({
  selector: 'app-crear-bienes',
  templateUrl: './crear-bienes.page.html',
  styleUrls: ['./crear-bienes.page.scss'],
})
export class CrearBienesPage implements OnInit {

  validations_form: FormGroup;
 
  genders: Array<string>;
  estado: Array<string>;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.genders = [
      "Tecnologicos",
      "Muebles",
      "libros",
    ];

    this.estado = [
      "Optimas Condiciones",
      "Tienes fallas Externas",
      "Sistema Operativo con fallas",
    ];

    this.validations_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        UsernameValidator.validUsername,
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required
      ])),
      nombre: new FormControl('', Validators.required),
      codigo: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],

    'precio': [
      { type: 'required', message: 'Name is required.' }
    ],

    'codigo': [
      { type: 'required', message: 'Name is required.' }
    ],

    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  onSubmit(values){
    console.log(values);
    this.router.navigate(["/user"]);
  }

}
