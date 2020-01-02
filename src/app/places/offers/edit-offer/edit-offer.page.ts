import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from 'src/app/models/place.model';

@Component({
	selector: 'app-edit-offer',
	templateUrl: './edit-offer.page.html',
	styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit {
	place: Place;
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
		});
	}
}
