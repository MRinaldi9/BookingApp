import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
	place: Place;
	form: FormGroup;
	private placesSub: Subscription;
	constructor(
		private placesService: PlacesService,
		private route: ActivatedRoute,
		private navCtrl: NavController
	) {}
	ngOnDestroy(): void {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/offers');
				return;
			}
			this.placesSub = this.placesService
				.getPlace(paramMap.get('placeId'))
				.subscribe(place => (this.place = place));
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
