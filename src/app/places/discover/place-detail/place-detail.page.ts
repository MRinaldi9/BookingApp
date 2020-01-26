import { Component, OnInit, OnDestroy } from '@angular/core';
import {
	NavController,
	ModalController,
	ActionSheetController
} from '@ionic/angular';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../../models/place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-place-detail',
	templateUrl: './place-detail.page.html',
	styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
	place: Place;
	private placesSub: Subscription;
	constructor(
		private navCtrl: NavController,
		private placesService: PlacesService,
		private activeRoute: ActivatedRoute,
		private modalCtrl: ModalController,
		public actionSheetController: ActionSheetController,
		public router: Router
	) {}
	ngOnDestroy(): void {
		if (this.placesSub) {
			this.placesSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.activeRoute.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/discover');
				return;
			}
			this.placesSub = this.placesService
				.getPlace(paramMap.get('placeId'))
				.subscribe(place => (this.place = place));
		});
	}
	onBookPlace() {
		this.actionSheetController
			.create({
				header: 'Choose an Action',
				buttons: [
					{
						text: 'Select Date',
						handler: () => {
							this.openBookingModal('select');
						}
					},
					{
						text: 'Random Date',
						handler: () => {
							this.openBookingModal('random');
						}
					},
					{ text: 'Cancel', role: 'cancel' }
				]
			})
			.then(actionSheetEl => actionSheetEl.present());
	}
	openBookingModal(mode: 'select' | 'random') {
		this.modalCtrl
			.create({
				component: CreateBookingComponent,
				componentProps: {
					selectedPlace: this.place,
					selectedMode: mode
				}
			})
			.then(modal => {
				modal.present();
				return modal.onDidDismiss();
			})
			.then(resulData => {
				console.log(resulData.data);

				if (resulData.role === 'confirm') {
					this.navCtrl.navigateBack('/places/tabs/discover');
				}
			});
	}
}
