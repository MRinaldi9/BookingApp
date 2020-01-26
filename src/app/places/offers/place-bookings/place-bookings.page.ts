import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from 'src/app/models/place.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../../services/places.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-place-bookings',
	templateUrl: './place-bookings.page.html',
	styleUrls: ['./place-bookings.page.scss']
})
export class PlaceBookingsPage implements OnInit, OnDestroy {
	place: Place;
	private placesSub: Subscription;
	constructor(
		private route: ActivatedRoute,
		private navCtrl: NavController,
		private placesService: PlacesService
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
			this.placesService
				.getPlace(paramMap.get('placeId'))
				.subscribe(place => (this.place = place));
		});
	}
}
