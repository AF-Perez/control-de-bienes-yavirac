import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  // public NOMBRE_SERVIDOR = 'http://192.168.137.4:8000'; 
  // public NOMBRE_SERVIDOR = 'http://10.0.2.2:8000';
  public NOMBRE_SERVIDOR = 'http://192.168.1.132:8000';

  // nobody outside the Store should have access to the BehaviourSubject
  private readonly _hostName = new BehaviorSubject<String>('');

  // expose the observable$ part of the _todos subject (read-only stream)
  readonly hostName$ = this._hostName.asObservable();

  // the getter will return the last value emitted in _todos subject
  get hostName(): String {
    return this._hostName.getValue();
  }

  // assigning a value to this.hostName will push it onto the observable
  // and down to all of its subscribers (ex: this.hostName = '10.0.2.2:9000')
  set hostName(val: String) {
    this._hostName.next(val);
  }

  // http://192.168.1.5:8101, http://192.168.56.1:8101
  constructor() { }
}
