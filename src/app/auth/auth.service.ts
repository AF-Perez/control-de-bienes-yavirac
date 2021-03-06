import { Injectable, OnDestroy } from '@angular/core';
// imports agregados por mi
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, map, share } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Usuario } from './user';
import { AuthRespuesta } from './auth-respuesta';
import { RespuestaLogin } from './respuesta-login';
import { User } from '../models/user.model';
import { Plugins } from '@capacitor/core';
import { GlobalsService } from '../services/globals.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  constructor(
    private  clienteHttp: HttpClient,
    private variablesGlobales: GlobalsService,
  ) { }

  private NOMBRE_SERVIDOR = this.variablesGlobales.NOMBRE_SERVIDOR;
  private _user = new BehaviorSubject<User>(null);
  authSubject  =  new BehaviorSubject(false);
  private _token = new BehaviorSubject<string>(null);
  private isLoggedIn = false;
  private _userId = null;
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._token.asObservable().pipe(
      map(token => {
        if (token) {
          return !!token;
        } else {
          return false;
        }
      }));
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      }));
  }

  get user() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user;
        } else {
          return null;
        }
      }));
  }

  logear(email: string, password: string ) {
    const datos = { email, password };
    return this.clienteHttp.post<RespuestaLogin>(`${this.NOMBRE_SERVIDOR}/api/login`, datos)
      .pipe(
        tap( resp => {
          // _user no esta siendo utilizado, linea dejada por si se necesite en un futuro
          this._user.next(new User('1', 'hola', resp.access_token, new Date(resp.expires_at)));
          // almacenando el token en la memoria y en el storage del dispositivo
          this._token.next(resp.access_token);
          this.storeAuthData('1', resp.access_token, resp.expires_at.toString());
        })
      );
  }

  logout() {
    if (!this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._token.next(null);
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData'});
  }

  estaLogueado() {
    return this.authSubject.asObservable();
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string
  ) {
    const data = JSON.stringify({
      userId,
      token,
      tokenExpirationDate,
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  getHeaders() {
    return this.user.pipe(
      map(userData => {
        if (!userData || !userData.token) {
          return null;
        }
        return new HttpHeaders({
          Authorization: 'Bearer ' + userData.token,
          Accept: 'application/json'
        });
      }),
    );
  }

  getHeaders2() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(authData => {
        if (!authData || !authData.value) {
          return null;
        }
        const parsedData = JSON.parse(authData.value) as {
          token: string,
          tokenExpirationDate: string,
          userId: string
        };
        return new HttpHeaders({
          Authorization: 'Bearer ' + parsedData.token,
          Accept: 'application/json'
        });
      }),
    );
  }

  autologin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          token: string,
          tokenExpirationDate: string,
          userId: string
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);

        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          'email',
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        console.log('autologueado');
        if (user) {
          this._user.next(user);
          this.autoLogout(1800000);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  private autoLogout(duration: number) {
    if (!this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
