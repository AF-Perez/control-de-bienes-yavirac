import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor() { }

  private bienes: {id: number, nombre: string}[] = [
    { "id": 0, "nombre": "mesa"},
    { "id": 1, "nombre": "silla"},
    { "id": 2, "nombre": "compu"},
    { "id": 3, "nombre": "pizarra"},
    { "id": 4, "nombre": "mesa negra"},
  ];

  // PENDIENTE coger desde api
  traerBienes() {
    return this.bienes;
  }

}
