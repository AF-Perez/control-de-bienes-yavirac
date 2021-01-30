import { Input, Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoadingController, ModalController, NavParams, Platform, ToastController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { TareasService } from 'src/app/services/tareas.service';
import { Storage } from '@ionic/storage';
import { BarcodeScannerOptions, BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Baja } from 'src/app/models/baja.model';
import { Conteo } from 'src/app/models/conteo.model';


const STORAGE_KEY = 'my_images';

@Component({
  selector: 'modal-conteo-page',
  templateUrl: './modal-conteo.page.html',
})
export class ModalConteoPage {

  form: FormGroup;
  formDataFoto: any;
  imgData: any;
  imgURL: any;
  images = [];
  imageBaja: any;
  idDeleted = -1;
  barcodeScannerOptions: BarcodeScannerOptions;

  // Data passed in by componentProps
  @Input() idBien: string;
  @Input() idAsignacion: string;
  // @Input() c: string;

  constructor(
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public servicioTareas: TareasService,
    private plt: Platform,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
  ) {
    // componentProps can also be accessed at construction time using NavParams
    this.idBien = navParams.get('idBien');
    this.idAsignacion = navParams.get('idAsignacion');
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      codigoBien: new FormControl('', Validators.required),
      cantidad: new FormControl(1, [
        Validators.min(0),
        Validators.max(100)
      ]),
    });

    this.plt.ready().then(() => {
      this.loadStoredImages();
    });

    this.idDeleted = -1;
  }

  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then((imgPath) => {
      var currentName = imgPath.substr(imgPath.lastIndexOf('/') + 1);
      var correctPath = imgPath.substr(0, imgPath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }, (err) => {
      console.error("Error: " + err);
    });
  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      // this.images = [newEntry, ...this.images];
      // console.log(this.images);
      this.imageBaja = newEntry;
      // console.log(this.imageBaja);
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  onSubmit(formValues) {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const conteo = new Conteo(formValues.codigoBien, formValues.cantidad);
        this.servicioTareas.agregarConteo(conteo);
        loadingEl.dismiss();
        this.form.reset();
        this.modalCtrl.dismiss();
      })
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  deleteImage(imgEntry, position) {
    this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('Achivo eliminado.');
      });
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  abrirScaner() {
    this.barcodeScanner.scan(this.barcodeScannerOptions).then(barcodeData => {
      this.form.patchValue({ codigo: barcodeData.text });
    }).catch(err => {
      console.error('Error', err);
    });
  }

  validation_messages = {
    codigoBien: [
      { type: 'required', message: 'Campo obligatorio.' },
    ],
    cantidad: [
      {type: 'required', message: 'Campo obligatorio'},
      {type: 'min', message: 'Ingrese una cantidad válida.'},
      {type: 'max', message: 'Ingrese una cantidad válida.'},
    ],
  };

}