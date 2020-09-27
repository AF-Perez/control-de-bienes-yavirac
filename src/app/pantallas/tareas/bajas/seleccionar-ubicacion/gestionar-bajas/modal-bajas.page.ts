import { Input, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { LoadingController, NavParams } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FilesService } from 'src/app/services/files.service';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Location } from '@angular/common';
import { TareasService } from 'src/app/services/tareas.service';


@Component({
  selector: 'modal-bajas-page',
  templateUrl: './modal-bajas.page.html',
})
export class ModalBajarPage {

  form: FormGroup;
  formDataFoto: any;
  imgData: any;
  imgURL: any;

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
    private filesService: FilesService,
    private loadingCtrl: LoadingController,
    private _location: Location,
    public servicioTareas: TareasService,
  ) {
    // componentProps can also be accessed at construction time using NavParams
    console.log(navParams.get('idBien'));
    console.log(navParams.get('idAsignacion'));
  }

  ngOnInit() {

  this.form = this.formBuilder.group({
        razonBaja: new FormControl('', Validators.required),
        // imagen: new FormControl('', Validators.required),
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

        this.servicioTareas.submitBaja(
          this.navParams.get('idBien'),
          this.navParams.get('idAsignacion'),
          valoresFormulario.razonBaja,
          this.imgData,
        );

        loadingEl.dismiss();
        this.form.reset();
        this._location.back();

      })
  }

}