import { Observable, fromEvent } from 'rxjs';

export class FileReaderObservable {
  public reader = new FileReader();

  private getEvent<T>(name: string): Observable<T> {
    console.log('name :>> ', name);
    console.log('this.reader :>> ', this.reader);

    return fromEvent<T>(this.reader, name);
     
  }

  get onAbort() { return this.getEvent<ProgressEvent>('abort') } // 中断時
  get onError() { return this.getEvent<ProgressEvent>('error') } // エラー時
  get onLoad() { return this.getEvent<ProgressEvent>('load') } // 読出し成功時
  get onLoadEnd() { return this.getEvent<ProgressEvent>('loadend') } // 成否を問わず読出し完了時
  get onLoadStart() { return this.getEvent<ProgressEvent>('loadstart') } // 読出し開始時
  get onProgress() { return this.getEvent<ProgressEvent>('progress') } // 読出し中(何回か発生)
}