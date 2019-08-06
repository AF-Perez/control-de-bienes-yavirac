import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../servicios/usuarios.service';
import {ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {

  usuarios: any[] = [];
  argumentos=null;

  constructor(
    public servicioUsuario: UsuariosService,
    private rutaActiva: ActivatedRoute,

  ) {}

  ionViewDidLoad(){
    
    this.servicioUsuario.obtenerUsuarios()
    .subscribe(
      (datos) => { 
        // exito
        this.usuarios = datos['results'];
      },
      (error) =>{ 
        // error
        console.error(error);
      }
    )
  }

  ngOnInit() {
    this.ionViewDidLoad();
    this.argumentos= this.rutaActiva.snapshot.paramMap.get('id');

  }

}
