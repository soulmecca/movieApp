import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myInput: string;
  favorites: Observable<any>;
  data;

  	constructor(
		public navCtrl: NavController, 
		public httpClient: HttpClient
		) {}

  	onInput (input) {
		// this.favorites = this.httpClient.get('http://localhost:3000/favorites.json');
		// this.favorites.subscribe(data => {
		// 	console.log('$$$$$', data)
		// })
		if(this.myInput === '') return 
		this.favorites = this.httpClient.get(`http://localhost:3000/favorites/find/${this.myInput}.json` );
		this.favorites.subscribe(data => {
			console.log('$$$$$', data)
			if(data) {
				this.data = data;
			}
		}, err=> {
			console.log('error is ', err)
		})

		// const body = {
		// 	title: "superman",
		// 	ranking: 10,
		// 	comment: 'very good'
		// }
		// this.httpClient.post('http://localhost:3000/favorites.json', body)
		// .subscribe(res => {
		// 	console.log('#### ', res)
		// }, err => {
		// 	console.log('error is ', err);
		// })
		
	  }
	  
	onClear  () {
		console.log('called!!!')
	}

}
