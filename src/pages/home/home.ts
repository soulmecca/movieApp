import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myInput: string;
  data;
  fetched;
  movies;
  apikey = "71d97bd7";

  	constructor(
		public navCtrl: NavController, 
		public httpClient: HttpClient,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController
		) {
			this.retrieveAll();
		}

	async retrieveAll () {
		const url = `http://localhost:3000/favorites.json`;
		try {	
			let allMovie = await this.httpClient.get(url).toPromise();
			console.log('@@@', allMovie)
			this.movies = allMovie;
		} catch (err) {
			console.log(err);
		}
	} 

  	async onInput (input) {

		if(this.myInput === '') {
			this.data = null;
			this.fetched = null;
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
	}
	
	
	onClear  () {
		this.data = null;
		this.fetched = null;
	}


	find () {
		console.log('%%%%%%', this.myInput)
		const url = `http://localhost:3000/favorites/find/${this.myInput}.json`;
		return this.httpClient.get(url).toPromise();
	}


	fetchMovie () {
		const url = `http://www.omdbapi.com/?apikey=${this.apikey}&t=`;
		return this.httpClient.get(url + this.myInput).toPromise();
	}


	async onSave () {
		try {
			let promptResponse:any = await this.showPrompt();
			console.log('$$$$$$ ', promptResponse)
			if(promptResponse.rating && isNaN(promptResponse.rating)) {
				this.presentToast('rating should be a number');
				this.onSave();			
			} else {
				const rating = parseInt(promptResponse.rating);
				const comment = promptResponse.comment.toLowerCase();
				console.log('@@@@', this.fetched)
				const url = `http://localhost:3000/favorites.json`;
		
				if(this.fetched) {
					const movie = this.fetched;
					const body = {
						title: movie['Title'],
						rating: rating,
						comment: comment
					}			
					let saved = await this.httpClient.post(url, body).toPromise();
					this.presentToast('Movie saved!');
				}					
			}
		} catch (err) {
			console.log(err);
		}
		
		
	}

	showPrompt() {
		return new Promise((resolve, reject) => {
			const prompt = this.alertCtrl.create({
				title: 'Rating',
				message: "Enter a rating from 1 to 10 and leave any comment",
				inputs: [
				  {
					name: 'rating',
					placeholder: 'Rating'
				  },
				  {
					  name: 'comment',
					  placeholder: 'Comment'
				  }
				],
				buttons: [
				  {
					text: 'Cancel',
					handler: data => {
					  console.log('Cancel clicked');
					  reject();
					}
				  },
				  {
					text: 'Save',
					handler: data => {
						resolve(data);
					}
				  }
				]
			  });
			  prompt.present();
		})

	}


	presentToast(message) {
		const toast = this.toastCtrl.create({
		  message: message,
		  duration: 3000
		});
		toast.present();
	}	
}
