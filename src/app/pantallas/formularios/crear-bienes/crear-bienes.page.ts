import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BienesService } from '../../../servicios/bienes.service';
import { BarcodeScannerOptions, BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { LoadingController } from '@ionic/angular';
import {Location} from '@angular/common';
import { TareaRegistroService } from '../../../services/tarea-registro.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-bienes',
  templateUrl: './crear-bienes.page.html',
  styleUrls: ['./crear-bienes.page.scss'],
})

export class CrearBienesPage implements OnInit, OnDestroy {

  validations_form: FormGroup;
  tiposDeBien: Array<string>;
  estados: Array<string>;
  ubicaciones: Array<string>;
  idUbicacion = null;
  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  private agregarBienSub: Subscription;

  constructor(
    public formBuilder: FormBuilder,
    private servicioBienes: BienesService,
    private servicioRegistro: TareaRegistroService,
    private activatedRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private _location: Location,

  ) { }

  ngOnInit() {
    this.idUbicacion = this.activatedRoute.snapshot.paramMap.get('idUbicacion');

    this.tiposDeBien = [
      "Tecnologicos",
      "Muebles",
      "Libros",
    ];

    this.estados = [
      "Bueno",
      "Regular",
      "Malo",
    ];

    this.ubicaciones = [
      "Aloasig",
      "Benito Juárez",
      "Yavirac",
    ];

    this.validations_form = this.formBuilder.group({
      codigo: new FormControl('', Validators.required),
      tiposDeBien: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      observaciones: new FormControl(''),
    });
  }

  ngOnDestroy() {
    if (this.agregarBienSub) {
      this.agregarBienSub.unsubscribe();
    }
  }

  onSubmit(valoresFormulario) {
    if (!this.validations_form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.agregarBienSub = this.servicioRegistro.agregarBien(
          valoresFormulario.codigo,
          valoresFormulario.tiposDeBien,
          valoresFormulario.nombre,
          valoresFormulario.estado,
          valoresFormulario.precio,
          this.idUbicacion,
          valoresFormulario.observaciones,
        )
        .subscribe(bien => {
          // acciones luego de guardar
          loadingEl.dismiss();
          this.validations_form.reset();
          this._location.back();
        });
      })
  }

  formataNumero(e: any, separador: string = '.', decimais: number = 2) {
    let a: any = e.value.split('');
    let ns: string = '';
    a.forEach((c: any) => { if (!isNaN(c)) ns = ns + c; });
    ns = parseInt(ns).toString();
    if (ns.length < (decimais + 1)) { ns = ('0'.repeat(decimais + 1) + ns); ns = ns.slice((decimais + 1) * -1); }
    let ans = ns.split('');
    let r = '';
    for (let i = 0; i < ans.length; i++) if (i == ans.length - decimais) r = r + separador + ans[i]; else r = r + ans[i];
    e.value = r;
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        console.error("Error", err);
      });
  }

  encodedText() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          this.encodeData = encodedData;
        },
        err => {
          console.error("Error occured : " + err);
        }
      );
  }

  abrirScaner() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.validations_form.patchValue({codigo: barcodeData.text});
     }).catch(err => {
         console.error('Error', err);
     });
  }

  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'nombre': [
      { type: 'required', message: 'Nombre del bien requerido.' }
    ],
    'precio': [
      { type: 'required', message: 'Precio es requerido.' }
    ],
    'codigo': [
      { type: 'required', message: 'El código es requerido.' }
    ],
    'terms': [
      { type: 'pattern', message: 'Usted acepta los cambiuos realizados.' }
    ],
  };

}
