import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Place } from '../../models/place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
	loadedPlaces: Place[];
	listedLoadedPlaces: Place[];
	private placesSub: Subscription;
	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController
	) {}
	ngOnDestroy(): void {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(places => {
			this.loadedPlaces = places;
			this.listedLoadedPlaces = this.loadedPlaces.slice(1);
		});
	}

	openMenu() {
		this.menuCtrl.toggle('m1');
	}

	onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		console.log(event.detail);
	}
}
