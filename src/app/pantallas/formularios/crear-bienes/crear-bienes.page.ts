import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BienesService } from '../../../servicios/bienes.service';
import { BarcodeScannerOptions, BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Location } from '@angular/common';
import { TareaRegistroService } from '../../../services/tarea-registro.service';
import { Subscription } from 'rxjs';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FilesService } from 'src/app/services/files.service';

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
  private traerBienesPorUbicSub: Subscription;
  bienesPadre = [];
  bienPadre: any;
  formDataFoto: any;
  imgData: any;
  imgURL: any;

  // @ViewChild('bienSelector') bienSelector: IonicSelectableComponent;

  constructor(
    public formBuilder: FormBuilder,
    private servicioBienes: BienesService,
    private servicioRegistro: TareaRegistroService,
    private activatedRoute: ActivatedRoute,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    private _location: Location,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private webview: WebView,
    private filesService: FilesService,
  ) { }

  ngOnInit() {
    this.idUbicacion = this.activatedRoute.snapshot.paramMap.get('idUbicacion');

    this.tiposDeBien = [
      "Tecnologicos",
      "Muebles",
      "Libros",
    ];

    this.estados = [
      "Nuevo",
      "Usado",
      "Malo",
    ];

    this.ubicaciones = [
      "Aloasig",
      "Benito Juárez",
      "Yavirac",
    ];

    this.validations_form = this.formBuilder.group({
      codigo: new FormControl(this.getSomeRandomString(), Validators.required),
      tiposDeBien: new FormControl('Muebles', Validators.required),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl('Usado', Validators.required),
      precio: new FormControl('0.0'),
      observaciones: new FormControl(''),
      codigoPadre: new FormControl({ id: -1, nombre: 'Ninguno' }),
    });

    this.traerBienesPorUbicSub = this.servicioBienes.traerBienesDeUbicacion(this.idUbicacion).subscribe(bienes => {
      this.bienesPadre = bienes;
    });

    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
      // formats : "QR_CODE",
    };
  }

  ngOnDestroy() {
    if (this.agregarBienSub) {
      this.agregarBienSub.unsubscribe();
    }

    if (this.traerBienesPorUbicSub) {
      this.traerBienesPorUbicSub.unsubscribe();
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

        this.servicioRegistro.agregarBien(
          valoresFormulario.codigo,
          valoresFormulario.tiposDeBien,
          valoresFormulario.nombre,
          valoresFormulario.estado,
          valoresFormulario.precio,
          this.idUbicacion,
          valoresFormulario.observaciones,
          valoresFormulario.codigoPadre,
          this.imgData,
        );
        loadingEl.dismiss();
        this.validations_form.reset();
        this._location.back();

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
    this.barcodeScanner.scan(this.barcodeScannerOptions).then(barcodeData => {
      this.validations_form.patchValue({ codigo: barcodeData.text });
    }).catch(err => {
      console.error('Error', err);
    });
  }

  leerArchivo(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const imgBlob = new Blob([reader.result], { type: file.type });
      this.imgData = { blob: imgBlob, name: file.name };
      console.log(this.imgData);
    };
    reader.readAsArrayBuffer(file);
  }

  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imageData) => {
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
        entry.file(file => {
          this.imgURL = this.filesService.validPathForDisplayImage(imageData);
          this.leerArchivo(file);
        });
        // this.imgData = entry;
      });
    }, (err) => {
      console.error("Error: " + err);
    });
  }

  getSomeRandomString() {
    return Math.random().toString(20).substr(2, 6);
  }

  cambiarCodigo() {
    this.validations_form.controls['codigo'].setValue(this.getSomeRandomString());
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
