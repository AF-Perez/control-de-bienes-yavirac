import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../servicios/usuarios.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  constructor(
    public servicioUsuario: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  )
  {}

  usuario;

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('idUsuario')) {
        // redirect
        this.router.navigate(['/caratula']);
        return;
      }
      const idReceta = paramMap.get('idUsuario');
      this.usuario = this.obtenerUsuario(idReceta);
    });

  }

  obtenerUsuario(id){
    this.servicioUsuario.obtenerUsuarios()
    .subscribe(
      (respuesta) => {
        // exito
        this.usuario = respuesta['results'].find(usuario => usuario.id.value === id );
      },
      (error) =>{
        // error
        console.log(error);
      }
    )

  }  
  
}
