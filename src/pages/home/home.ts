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
//   favorites: Observable<any>;
  data;
  fetched;
  apikey = "71d97bd7";

  	constructor(
		public navCtrl: NavController, 
		public httpClient: HttpClient
		) {}


  	async onInput (input) {
		// this.favorites = this.httpClient.get('http://localhost:3000/favorites.json');
		// this.favorites.subscribe(data => {
		// 	console.log('$$$$$', data)
		// })
		if(this.myInput === '') {
			this.data = null;
			return
		}

		try {
			let response = await this.find();
			console.log('$$$$$', response);
			if (response) {
				this.data = response;
			} else {
				let fetched = await this.fetchMovie();
				console.log('###', fetched)
				if(fetched) this.fetched = fetched;
			}
		} catch (err) {
			console.log(err);
		}

			

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
		const url = `http://localhost:3000/favorites/find/${this.myInput}.json`;
		return this.httpClient.get(url).toPromise();
	}


	fetchMovie () {
		const url = `http://www.omdbapi.com/?apikey=${this.apikey}&t=`;
		return this.httpClient.get(url + this.myInput).toPromise();
	}


}
