import { Input, Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { LoadingController, ModalController, NavParams, Platform, ToastController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FilesService } from 'src/app/services/files.service';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Location } from '@angular/common';
import { TareasService } from 'src/app/services/tareas.service';
import { Storage } from '@ionic/storage';

import { finalize } from 'rxjs/operators';


const STORAGE_KEY = 'my_images';

@Component({
  selector: 'modal-bajas-page',
  templateUrl: './modal-bajas.page.html',
})
export class ModalBajarPage {

  form: FormGroup;
  formDataFoto: any;
  imgData: any;
  imgURL: any;
  images = [];
  imageBaja: any;

  // Data passed in by componentProps
  @Input() idBien: string;
  @Input() idAsignacion: string;
  // @Input() c: string;

  constructor(
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private webview: WebView,
    private storage: Storage,
    private filesService: FilesService,
    private loadingCtrl: LoadingController,
    private _location: Location,
    public servicioTareas: TareasService,
    private plt: Platform,
    private toastController: ToastController,
    private ref: ChangeDetectorRef,
    private modalCtrl: ModalController,
  ) {
    // componentProps can also be accessed at construction time using NavParams
    // console.log(navParams.get('idBien'));
    // console.log(navParams.get('idAsignacion'));
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      razonBaja: new FormControl('', Validators.required),
      // imagen: new FormControl('', Validators.required),
    });

    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
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

  readFile(file: any, valoresFormulario) {
    const reader = new FileReader();
    reader.onload = () => {
      const imgBlob = new Blob([reader.result], { type: file.type });
      const imgData = { blob: imgBlob, name: file.name };
      console.warn(imgData);
      this.servicioTareas.submitBaja(
        this.navParams.get('idBien'),
        this.navParams.get('idAsignacion'),
        valoresFormulario.razonBaja,
        imgData,
      ).subscribe((_) => {
        console.log('ranndlfjkfdj');
      });
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

  onSubmit(valoresFormulario) {
    if (!this.form.valid) {
      return;
    }
  
    this.loadingCtrl
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {
        loadingEl.present();
        console.log(this.imageBaja.filePath);
        this.file.resolveLocalFilesystemUrl(this.imageBaja.filePath)
          .then(entry => {
            (<FileEntry>entry).file(file => this.readFile(file, valoresFormulario));
            loadingEl.dismiss();
            this.form.reset();
            this.imageBaja = null;
            // this._location.back();
            this.closeModal();
            
          });
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

  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file, ''))
      })
      .catch(err => {
        this.presentToast('Error al leer el archivo.');
      });
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Uploading image...',
    });
    await loading.present();

    // this.http.post("http://localhost:8888/upload.php", formData)
    //   .pipe(
    //     finalize(() => {
    //       loading.dismiss();
    //     })
    //   )
    //   .subscribe(res => {
    //     if (res['success']) {
    //       this.presentToast('File upload complete.')
    //     } else {
    //       this.presentToast('File upload failed.')
    //     }
    //   });
  }

  closeModal()
  {
    this.modalCtrl.dismiss();
  }

}