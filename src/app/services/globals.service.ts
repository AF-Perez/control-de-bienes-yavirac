import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  public NOMBRE_SERVIDOR = 'http://192.168.0.5:8000'; 

  constructor() { }
}
