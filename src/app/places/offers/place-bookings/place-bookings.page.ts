import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/models/place.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../../services/places.service';

@Component({
	selector: 'app-place-bookings',
	templateUrl: './place-bookings.page.html',
	styleUrls: ['./place-bookings.page.scss']
})
export class PlaceBookingsPage implements OnInit {
	place: Place;
	constructor(
		private route: ActivatedRoute,
		private navCtrl: NavController,
		private placesService: PlacesService
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
