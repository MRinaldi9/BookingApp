import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../../services/places.service';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
	selector: 'app-new-offer',
	templateUrl: './new-offer.page.html',
	styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
	form: FormGroup;
	constructor(
		private placesService: PlacesService,
		private navController: NavController,
		private loadingController: LoadingController
	) {}

	ngOnInit() {
		this.form = new FormGroup({
			title: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			}),
			description: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required, Validators.maxLength(180)]
			}),
			price: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.min(1)]
			}),
			dateFrom: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			}),
			dateTo: new FormControl(null, {
				updateOn: 'blur',
				validators: [Validators.required]
			})
		});
	}

	onCreateOffer() {
		if (!this.form.valid) {
			return;
		}
		const formValue = this.form.value;
		this.loadingController
			.create({ message: 'Creating Place...', spinner: 'dots' })
			.then(loadingEl => {
				loadingEl.present();
				this.placesService
					.addPlace(
						formValue.title,
						formValue.description,
						+formValue.price,
						new Date(formValue.dateFrom),
						new Date(formValue.dateTo)
					)
					.subscribe(() => {
						this.loadingController.dismiss();
						this.navController.navigateBack('/places/tabs/offers');
					});
			});
	}
}
