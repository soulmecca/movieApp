import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myInput: string;

  constructor(public navCtrl: NavController) {

  }

  onInput (input) {
        
  }

}
