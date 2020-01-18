import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit {
	place: Place;
	form: FormGroup;
	constructor(
		private placesService: PlacesService,
		private route: ActivatedRoute,
		private navCtrl: NavController
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/offers');
				return;
			}
			this.place = this.placesService.getPlace(paramMap.get('placeId'));
			this.form = new FormGroup({
				title: new FormControl(this.place.title, {
					updateOn: 'blur',
					validators: [Validators.required, Validators.minLength(2)]
				}),
				description: new FormControl(this.place.description, {
					updateOn: 'blur',
					validators: [Validators.required, Validators.maxLength(180)]
				})
			});
		});
	}

	onUpdateOffer() {
		if (!this.form.valid) {
			return;
		}
		console.log(this.form);
	}
}
