import { Input } from '@angular/core';
import { NavParams } from '@ionic/angular';

export class ModalBajarPage {

    // Data passed in by componentProps
    @Input() a: string;
    @Input() b: string;
    @Input() c: string;
  
    constructor(navParams: NavParams) {
      // componentProps can also be accessed at construction time using NavParams
      console.log(navParams.get('a'));
    }
  
  }