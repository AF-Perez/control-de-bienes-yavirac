import { Injectable } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private webview: WebView,
  ) { }

  validPathForDisplayImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  obtenerBlob(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      // const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      return imgBlob;
    };
    reader.readAsArrayBuffer(file);
  }
}
