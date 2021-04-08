import { TareasService } from './../../../../../services/tareas.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalBajasPage } from './modal-bajas.page';
import { Location } from '@angular/common';
import { Baja } from 'src/app/models/baja.model';
import { Subscription, forkJoin, Observable, from, Observer, merge, throwError } from 'rxjs';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { LoadingController } from '@ionic/angular';
import { FileReaderObservable } from './filereader';
import { flatMap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-gestionar-bajas',
  templateUrl: './gestionar-bajas.page.html',
  styleUrls: ['./gestionar-bajas.page.scss'],
})
export class GestionarBajasPage implements OnInit {

  ubicacion: any;
  fecha: any;
  observaciones: any;
  bienes: any = [];
  idAsignacion: any;
  bajas: Baja[] = [];
  private bajasSub: Subscription;
  bajasRequests: [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioBienes: BienesService,
    private servicioTareas: TareasService,
    public alertController: AlertController,
    private modalController: ModalController,
    private tareasService: TareasService,
    private _location: Location,
    private file: File,
    private toastController: ToastController,
    private loadingController: LoadingController,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.ubicacion = this.router.getCurrentNavigation().extras.state.ubicacion;
        this.idAsignacion = this.router.getCurrentNavigation().extras.state.idAsignacion;
      }
    });
  }

  ngOnInit() {
    this.obtenerFechaActual();
    this.servicioTareas.bajasTarea.subscribe(bajas => {
      console.log('bajas en gestionar-bajas', bajas);
      this.bajas = bajas;
    });
  }

  obtenerFechaActual() {
    this.fecha = new Date();
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: ModalBajasPage,
      componentProps: {
        idAsignacion: this.idAsignacion,
      },
    });

    modal.onDidDismiss()
      .then((data) => {
        if (data['data'].idDeleted !== -1) {
          this.bienes = this.bienes.filter(bien => {
            return bien.id !== data['data'].idDeleted;
          });
        }
      });

    return await modal.present();
  }

  // ingresarTarea(idTarea) {
  //   this.loadingController
  //     .create({
  //       message: 'Procesando solicitud...'
  //     })
  //     .then(loadingEl => {

  //       loadingEl.present();

  //       let promises = [];

  //       console.log(this.bajas);

  //       this.bajas.forEach((baja) => {
  //         let tempPromise = this.file.resolveLocalFilesystemUrl(baja.imgData.filePath);
  //         promises.push(tempPromise);
  //       });

  //       // .then(entry => {
  //       //   (<FileEntry>entry).file(file => this.readFile(file, baja));
  //       // });

  //       forkJoin(promises).subscribe(val => {
  //         console.log(val);
  //       });

  //     });
  // }

  async getFile(fileEntry) {
    try {
      return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
      console.log(err);
    }
  }

  ingresarTarea(idTarea) {
    this.loadingController
      .create({
        message: 'Procesando solicitud...'
      })
      .then(loadingEl => {

        loadingEl.present();
        console.log('this.bajas :>> ', this.bajas);

        let resolvLocalFSObsArr = [];

        this.bajas.forEach((baja) => {
          resolvLocalFSObsArr.push(from(this.file.resolveLocalFilesystemUrl(baja.imgData.filePath)));
          // .then(entry => {
          //   // (<FileEntry>entry).file(file => this.readFile(file, baja));
          // });
        });

        forkJoin(resolvLocalFSObsArr)
          .subscribe((fentries) => {
            console.log('res :>> ', fentries);
            let getFileObs = fentries.map(fe => {
              return from(this.getFile(fe));
            });
            console.log('getFileObs :>> ', getFileObs);
            forkJoin(getFileObs)
              .subscribe((files) => {
                console.log('files :>> ', files);
                // let readFileObs = files.map(file => {
                //   // return this.readFile(file);
                //   return from(this.readFile(file));
                // });

                // console.log('readFileObs :>> ', readFileObs);

                this.readFiles(files);
               

                // forkJoin(readFileObs).subscribe((imgData) => {
                //   console.log('imgData :>> ', imgData);
                // });
              });
          });

        setTimeout(() => {
          loadingEl.dismiss();

          // console.log('All done!');
          // this.servicioTareas.completarTarea(idTarea).subscribe(respuesta => {
          //   this.tareasService.removerTarea(this.idAsignacion);
          //   loadingEl.dismiss();
          //   this._location.back();
          // });
        }, 4000);
      });
  }

  readFiles( files: any[] ) {
    from( files ).pipe( this.readAsText() ).subscribe( 
      ( res ) => console.log( res ),
      ( err )=> console.log( err ) ,
      ()=>console.log( 'end' )
    );
  }

  readAsText = () => ( src: Observable<any> ) => {
    return src.pipe(
      flatMap( file => {
        const obs = new FileReaderObservable();
        // 中断かエラーが生じたら例外を投げるObservable
        const failed = merge( obs.onAbort, obs.onError ).pipe( flatMap( evt => throwError( `Cannot read file. ${file.name}.` ) ) );
   
        // ファイルの読出しが成功したら結果を文字列として返すObservable
        // Typescript 3.5.*での問題
        // https://github.com/microsoft/TypeScript/issues/25510
        // eventtarget.resultが消えてしまっているためany化している
        const data = obs.onLoad.pipe( map( evt => ( evt as any ).target.result as string ) );
         
        // 読出し開始
        obs.reader.readAsText( file );
   
        // mergeで、読出しと例外の発生を監視するObservableを統合し、
        // takeUntilで成否を問わず読出しが完了したら購読を終了するようにする。
        return merge( data, failed ).pipe( takeUntil( obs.onLoadEnd ) );
      } )
    );
  }


  readFile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsArrayBuffer(file);
    })
  }
  

  // readFile(file): Observable<any> {

  //   console.log('alfdjlkj :>> ');

  //   const reader = new FileReader();

  //   return new Observable((observer: Observer<any>) => {
  //     reader.readAsArrayBuffer(file);
  //     reader.onload = () => {
  //       const imgBlob = new Blob([reader.result], { type: file.type });
  //       const imgData = { blob: imgBlob, name: file.name };
  //       observer.next(imgData);
  //       observer.complete();
  //     };
  //     reader.onerror = () => {
  //       observer.error({ error: { name, errorMessage: 'INVALID_FILE' } });
  //     };
  //   });

  // }

  // readFile(file: any) {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const imgBlob = new Blob([reader.result], { type: file.type });
  //     const imgData = { blob: imgBlob, name: file.name };
  //     // this.servicioTareas.submitBaja(
  //     //   baja.codigoBien,
  //     //   this.idAsignacion,
  //     //   baja.motivoBaja,
  //     //   imgData,
  //     // )
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  // readFile(file: any, baja: Baja) {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     console.log('file loaded');
  //     const imgBlob = new Blob([reader.result], { type: file.type });
  //     const imgData = { blob: imgBlob, name: file.name };
  //     this.servicioTareas.submitBaja(
  //       baja.codigoBien,
  //       this.idAsignacion,
  //       baja.motivoBaja,
  //       imgData,
  //     ).subscribe((_) => {
  //       console.log('in readfile')
  //       this.deleteImage(baja.imgData);
  //       this.servicioTareas.removerBaja(baja.codigoBien);
  //     },
  //       (err) => {
  //         console.error("Error " + err)
  //       }
  //     )
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  // startUpload(imgEntry) {
  //   this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
  //     .then(entry => {
  //       (<FileEntry>entry).file(file => this.readFile(file, ''))
  //     })
  //     .catch(err => {
  //       this.presentToast('Error al leer el archivo.');
  //     });
  // }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  deleteImage(imgEntry) {
    var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
    this.file.removeFile(correctPath, imgEntry.name).then(res => {
      this.presentToast('Achivo eliminado.');
    });
  }

  ngOnDestroy() {
    if (this.bajasSub) {
      this.bajasSub.unsubscribe();
    }
  }

}


