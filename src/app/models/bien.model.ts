export class Bien {
    constructor(
      public codigo: string,
      public tipo: string,
      public nombre: string,
      public estado: string,
      public precio: number,
      public custodio: string,
      public idUbicacion: string,
      public observaciones: string,
    ) {}
  }
  