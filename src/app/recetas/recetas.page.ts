import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../servicios/usuarios.service';


@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {

  usuarios: any[] = [];

  constructor(
    public servicioUsuario: UsuariosService

  ) {}

  ionViewDidLoad(){
    
    this.servicioUsuario.obtenerUsuarios()
    .subscribe(
      (data) => { // Success
        this.usuarios = data['results'];
      },
      (error) =>{
        console.error(error);
      }
    )
  }

  ngOnInit() {
    this.ionViewDidLoad();
  }

}
