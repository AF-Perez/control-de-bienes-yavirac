import { Injectable } from '@angular/core';
// imports agregados por mi
import { HttpClient } from  '@angular/common/http';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject, from } from  'rxjs';
import { Storage } from  '@ionic/storage';
import { Usuario } from  './user';
import { AuthRespuesta } from  './auth-respuesta';
import { RespuestaLogin } from './respuesta-login';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private  clienteHttp:  HttpClient, 
    private almacenamiento: NativeStorage,
  ) { }

  NOMBRE_SERVIDOR:  string  =  'http://localhost:8000';
  authSubject  =  new  BehaviorSubject(false);
  token: any;
  isLoggedIn = false;

  registrar(user: Usuario) : Observable<AuthRespuesta> {
    return this.clienteHttp.post<AuthRespuesta>(`${this.NOMBRE_SERVIDOR}/register`, user).pipe(
      tap(async (resp:  AuthRespuesta ) => {
        // si el servidor me acepta los datos
        if (resp.user) {
          // como proceso la respuesta del servidor
          await this.almacenamiento.setItem("ACCESS_TOKEN", resp.user.access_token);
          await this.almacenamiento.setItem("EXPIRES_IN", resp.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }

  logear(email: string, password: string ) {
    const datos = {
      email,
      password,
    };

    return this.clienteHttp.post(`${this.NOMBRE_SERVIDOR}/api/login`, datos)
      .pipe(
        tap( token => {
          // almacenar el token en el cache
          this.almacenamiento.setItem('ACCESS_TOKEN', token)
          .then(
            () => {
              this.isLoggedIn = true;
            },
            error => {
              console.error('Error storing item', error);
            }
          );
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

  getToken() {
    return this.almacenamiento.getItem('ACCESS_TOKEN').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }
  
 

  estaLogueado() {
    return this.authSubject.asObservable();
  }
}
