import { Injectable } from '@angular/core';
// imports agregados por mi
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { Usuario } from  './user';
import { AuthRespuesta } from  './auth-respuesta';
import { RespuestaLogin } from './respuesta-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private  clienteHttp:  HttpClient, private almacenamiento: Storage) { }

  NOMBRE_SERVIDOR:  string  =  'http://localhost:8000';
  authSubject  =  new  BehaviorSubject(false);

  registrar(user: Usuario) : Observable<AuthRespuesta> {
    return this.clienteHttp.post<AuthRespuesta>(`${this.NOMBRE_SERVIDOR}/register`, user).pipe(
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

  logear1(user: Usuario) : Observable<AuthRespuesta>{
    return this.clienteHttp.post<AuthRespuesta>(`${this.NOMBRE_SERVIDOR}/oauth/token`, user).pipe(
      tap(async (resp:  AuthRespuesta ) => {
        // si el servidor me acepta los datos
        if (resp.user) {
          // como proceso la respuesta del servidor
          // almacenar el token en el cache 
          await this.almacenamiento.set("ACCESS_TOKEN", resp.user.access_token);
          // alamacena la expiracion del token
          await this.almacenamiento.set("EXPIRES_IN", resp.user.expires_in);
         
          // retornar
          this.authSubject.next(true);
        }
      })
    );
  }


  logear(user: Usuario ) : Observable<RespuestaLogin>{
    let datos = { 
      username:'mario@mail.com',
      password:'password',
      grant_type:'password',
      client_id:'4',
      client_secret:'U8QwslDbb8Ivp8c6F3BDjQLXDfrkuTajH97sHTih',
    };

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };

    var url = `${this.NOMBRE_SERVIDOR}/oauth/token`;

    return this.clienteHttp.post<RespuestaLogin>(`${this.NOMBRE_SERVIDOR}/oauth/token`, datos, options).pipe(

      tap(async (resp:  RespuestaLogin ) => {
        // si el servidor me acepta los datos
        alert(resp);
        if (resp.user) {
          // como proceso la respuesta del servidor
          // almacenar el token en el cache 
          await this.almacenamiento.set("ACCESS_TOKEN", resp.user.access_token);
          // alamacena la expiracion del token
          await this.almacenamiento.set("EXPIRES_IN", resp.user.expires_in);
         
          // retornar
          this.authSubject.next(true);
        }
      })
    );

  }

  async logout() {
    //elimina el token del cache
    await this.almacenamiento.remove("ACCESS_TOKEN");
    //elimina el tiempo de expirar del token 
    await this.almacenamiento.remove("EXPIRES_IN");

    // retornar
    this.authSubject.next(false);
  }

  estaLogueado() {
    return this.authSubject.asObservable();
  }
}
