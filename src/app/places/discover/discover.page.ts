import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Place } from '../../models/place.model';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-discover',
	templateUrl: './discover.page.html',
	styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
	loadedPlaces: Place[];
	relevantPlaces: Place[];
	listedLoadedPlaces: Place[];
	isLoading = false;
	private placesSub: Subscription;

	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController,
		private authService: AuthService
	) {}

	ngOnDestroy(): void {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(places => {
			this.loadedPlaces = places;
			this.relevantPlaces = this.loadedPlaces;
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		});
	}

	ionViewWillEnter() {
		this.isLoading = true;
		this.placesService.fetchPlaces().subscribe(places => {
			this.isLoading = false;
		});
	}

	openMenu() {
		this.menuCtrl.toggle('m1');
	}

	onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
		if (event.detail.value === 'all') {
			this.relevantPlaces = this.loadedPlaces;
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		} else {
			this.relevantPlaces = this.loadedPlaces.filter(
				place => place.userId !== this.authService.userId
			);
			this.listedLoadedPlaces = this.relevantPlaces.slice(1);
		}
	}
}
