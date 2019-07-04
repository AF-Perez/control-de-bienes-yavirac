import { Injectable } from '@angular/core';
// imports agregados por mi
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { Usuario } from  './user';
import { AuthRespuesta } from  './auth-respuesta';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private  clienteHttp:  HttpClient, private almacenamiento: Storage) { }

  AUTH_SERVER_ADDRESS:  string  =  'http://localhost:3000';
  authSubject  =  new  BehaviorSubject(false);

  registrar(user: Usuario) {
    return this.clienteHttp.post<AuthRespuesta>(`${this.AUTH_SERVER_ADDRESS}/register`, user).pipe(
      tap(async (resp:  AuthRespuesta ) => {
        // si el servidor me acepta los datos
        if (resp.user) {
          // como proceso la respuesta del servidor
          await this.almacenamiento.set("ACCESS_TOKEN", resp.user.access_token);
          await this.almacenamiento.set("EXPIRES_IN", resp.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }
}
