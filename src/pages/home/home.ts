import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { findLast } from '@angular/compiler/src/directive_resolver';

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
		if(this.myInput === '') {
			this.data = null;
			return
		}

		this.find();

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
		this.data = null;
	}


	find () {
		this.favorites = this.httpClient.get(`http://localhost:3000/favorites/find/${this.myInput}.json` );
		this.favorites.subscribe(data => {
			console.log('$$$$$', data)
			if(data) {
				this.data = data;
			}
		}, err=> {
			console.log('error is ', err)
		})		
	}


	fetchMovie () {
		
	}


}
