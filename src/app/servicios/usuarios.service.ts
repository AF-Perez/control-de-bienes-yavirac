import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }
  
  obtenerUsuarios() {
    return this.http.get('https://randomuser.me/api/?results=25');
  }

}
