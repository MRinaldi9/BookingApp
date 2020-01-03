import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Place } from 'src/app/models/place.model';
import { MenuController, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
	loadedOffers: Place[];
	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController,
		private router: Router
	) {}

	ngOnInit() {
		this.loadedOffers = this.placesService.places;
	}
	openMenu() {
		this.menuCtrl.toggle('m1');
	}
	onEdit(id: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.router.navigateByUrl(`/places/tabs/offers/edit/${id}`);
	}
}
