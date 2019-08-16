import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {

  constructor() { }

  private ubicaciones: {id: number, nombre: string}[] = [
    { "id": 0, "nombre": "biblioteca"},
    { "id": 1, "nombre": "aula 1"},
    { "id": 2, "nombre": "aula 2"},
    { "id": 3, "nombre": "oficina 1"},
    { "id": 4, "nombre": "rectorado"},
  ];

  // PENDIENTE coger desde api
  obtenerUbicaciones() {
    return this.ubicaciones;
  }
}
