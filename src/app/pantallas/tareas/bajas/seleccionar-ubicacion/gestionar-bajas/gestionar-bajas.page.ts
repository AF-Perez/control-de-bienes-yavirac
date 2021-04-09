import { TareasService } from './../../../../../services/tareas.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesService } from '../../../../../servicios/bienes.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalBajasPage } from './modal-bajas.page';
import { Location } from '@angular/common';
import { Baja } from 'src/app/models/baja.model';
import { Subscription, forkJoin, Observable, from, Observer, merge, throwError, timer } from 'rxjs';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { LoadingController } from '@ionic/angular';
import { FileReaderObservable } from './filereader';
import { flatMap, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';

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
              .subscribe((files: File[]) => {
                console.log('files :>> ', files);

                // let readFileObs = files.map(file => {
                //   // return this.readFile(file);
                //   return from(this.readFile(file));
                // });

                // console.log('readFileObs :>> ', readFileObs);

                for (let i = 0; i < files.length; i++) { 
                  this.readFile(files[i], this.bajas[i]);
                }
                
                // this.readFiles(files);

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

  readFiles(files: File[]) {
    from(files).pipe(this.readAsArrayBuffer()).subscribe(
      (res) => console.log(res),
      (err) => console.error(err),
      () => console.log('end')
    );
  }


  readAsArrayBuffer = () => (src: Observable<File>) => {
    return src.pipe(
      flatMap((file: any) => {
        let obs = new FileReaderObservable();
        console.log('obs :>> ', obs);

        let failed = merge(obs.onAbort, obs.onError).pipe(mergeMap(evt => throwError(`Cannot read file. ${file.name}.`)));
        let data = obs.onLoad.pipe(
          switchMap(evt => {
            // console.log('evt :>> ', evt);
            return from([1, 3, 4])
          }),
        );
        // let end = obs.onLoadEnd.pipe(map(evt => (evt as any).target.result));
        obs.reader.readAsArrayBuffer(file);
        console.log('data :>> ', data);

        const timer$ = timer(5000);
        return merge(data, failed).pipe(takeUntil(timer$));
      })
    );
  }

  readFileInfo(file: any): Observable<{ file: File }> {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file);
    return Observable.create((observer: Observer<{ file }>) => {
      reader.onload = (e: Event) => {
        observer.next(file)
        observer.complete()
      }
      return () => {
        if (!reader.result) {
          console.warn('read file aborted')
          reader.abort()
        }
      }
    })
  }

  // readFile(file) {
  //   return (
  //     new Observable<string | ArrayBuffer>(subscriber => {
  //       const reader = new FileReader();
  //       reader.readAsArrayBuffer(file);
  //       reader.onload = () => { subscriber.next(reader.result); subscriber.complete(); };
  //       reader.onerror = () => subscriber.error(reader.error);
  //       return () => reader.abort(); // cancel function in case you unsubscribe from the obs
  //     })
  //   )
  // }



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

  readFile(file: any, baja: Baja) {
    console.log('file :>> ', file);
    console.log('baja :>> ', baja);
    const reader = new FileReader();
    reader.onload = () => {
      console.log('file loaded');
      const imgBlob = new Blob([reader.result], { type: file.type });
      const imgData = { blob: imgBlob, name: file.name };
      this.servicioTareas.submitBaja(
        baja.codigoBien,
        this.idAsignacion,
        baja.motivoBaja,
        imgData,
      ).subscribe((_) => {
        console.log('in readfile')
        this.deleteImage(baja.imgData);
        this.servicioTareas.removerBaja(baja.codigoBien);
      },
        (err) => {
          console.error("Error " + err)
        }
      )
    };
    reader.readAsArrayBuffer(file);
  }

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


