import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';


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
	backendUrl: string = 'http://localhost:3000/favorites';

  	constructor(
		public navCtrl: NavController, 
		public httpClient: HttpClient,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController
		) {
			this.retrieveAll();
		}

	// Get all movie data that is stored in backend	
	async retrieveAll () {
		const url = this.backendUrl + '.json';
		try {	
			let allMovie = await this.httpClient.get(url).toPromise();
			this.movies = allMovie;
		} catch (err) {
			console.log(err);
		}
	} 

	// Triggered when a user enter search for a movie
  	async onInput (input) {

		if(this.myInput === '') {
			this.data = null;
			this.fetched = null;
			return
		}

		try {
			let response = await this.find();
			if (response) {
				this.presentToast(`${this.myInput} is alreay in your favorite`);
				this.data = response;
				this.fetched = null;
			} else {
				let fetched = await this.fetchMovie();
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
		const input = this.makeFirstUppercase(this.myInput);
		const url = this.backendUrl + `/find/${input}.json`;
		return this.httpClient.get(url).toPromise();
	}


	fetchMovie () {
		const url = `http://www.omdbapi.com/?apikey=${this.apikey}&t=`;
		return this.httpClient.get(url + this.myInput).toPromise();
	}


	async onSave () {
		try {
			let promptResponse:any = await this.showPrompt();
			// When rating is not a number
			if(promptResponse.rating && isNaN(promptResponse.rating)) {
				this.presentToast('rating should be a number');
				this.onSave();			
			} else {
				const rating = parseInt(promptResponse.rating);
				let comment = promptResponse.comment.toLowerCase();

				const url = this.backendUrl + `.json`;
		
				if(this.fetched) {
					const movie = this.fetched;
					const body = {
						title: movie['Title'],
						rating: rating,
						comment: comment
					}			
					await this.httpClient.post(url, body).toPromise();
					this.presentToast('Movie saved!');
					this.fetched = null;
					this.retrieveAll();
				}					
			}
		} catch (err) {
			console.log(err);
		}
	}


	async onEdit (movie, i) {
		try {
			let prompted:any = await this.showPrompt(movie);

			if (prompted.rating && isNaN(prompted.rating)) {
				this.presentToast('rating should be a number');
				this.onEdit(movie, i);
			} 
			// rating is a number
			else {
				const url = this.backendUrl + `/${movie.id}.json`;
				let body = {rating: parseInt(prompted.rating)};
				let edited = await this.httpClient.put(url, body).toPromise();
				this.presentToast('Movie edited');
				this.movies[i] = edited;
			}
		} catch (err) {
			console.log(err);
		}

		
	}

	showPrompt(movie?) {
		let inputs;
		if(movie) {
			inputs = [
				{
				  name: 'rating',
				  placeholder: 'Rating',
				  value: movie.rating
				}
		  ]
		} else {
			inputs = [
				{
				  name: 'rating',
				  placeholder: 'Rating'
				},
				{
					name: 'comment',
					placeholder: 'Comment'
				}
			  ]
		}
		
		return new Promise((resolve, reject) => {
			const prompt = this.alertCtrl.create({
				title: 'Rating',
				message: "Enter a rating from 1 to 10 and leave any comment",
				inputs: inputs,
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
		  duration: 3000,
		  position: 'top'
		});
		toast.present();
	}	


	async onRemove (movie) {
		
		const url = this.backendUrl + `/${movie.id}.json`;
		try {
			await this.presentConfirm();
			await this.httpClient.delete(url).toPromise();
			this.presentToast('Movie deleted')
			this.retrieveAll();
		} catch (err) {
			console.log(err);
		}
	}

	// To make every first letter capital 
	// Following the way omdbapi uses to store a title of a movie
	makeFirstUppercase (title) {
		let arr = title.split(' ');
		for (var i = 0; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);     
		}
		return arr.join(' ');
	}

	presentConfirm() {
		return new Promise((resolve, reject) => {
			let alert = this.alertCtrl.create({
				title: 'Sure to delete?',
				message: 'Once you delete this movie, there is no turning back.',
				buttons: [
				  {
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
					  console.log('Cancel clicked');
					  reject();
					}
				  },
				  {
					text: 'Delete',
					handler: () => {
					  	console.log('Delete clicked');
						resolve();
					}
				  }
				]
			  });
			  alert.present();
		})
	}	
}
