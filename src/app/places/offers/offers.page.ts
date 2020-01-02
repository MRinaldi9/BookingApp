import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Place } from 'src/app/models/place.model';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
	loadedOffers: Place[];
	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController
	) {}

	ngOnInit() {
		this.loadedOffers = this.placesService.places;
	}
	openMenu() {
		this.menuCtrl.open('m1');
	}
}
