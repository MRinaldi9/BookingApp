import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import { Place } from 'src/app/models/place.model';
import { MenuController, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
	loadedOffers: Place[];
	private placesSub: Subscription;
	constructor(
		private placesService: PlacesService,
		private menuCtrl: MenuController,
		private router: Router
	) {}
	ngOnDestroy(): void {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.placesSub = this.placesService.places.subscribe(
			offers => (this.loadedOffers = offers)
		);
	}
	openMenu() {
		this.menuCtrl.toggle('m1');
	}
	onEdit(id: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.router.navigateByUrl(`/places/tabs/offers/edit/${id}`);
	}
}
