import { Component, OnInit } from '@angular/core';
import {
	NavController,
	ModalController,
	ActionSheetController
} from '@ionic/angular';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Place } from '../../../models/place.model';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
	selector: 'app-place-detail',
	templateUrl: './place-detail.page.html',
	styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit {
	place: Place;
	constructor(
		private navCtrl: NavController,
		private placesService: PlacesService,
		private activeRoute: ActivatedRoute,
		private modalCtrl: ModalController,
		public actionSheetController: ActionSheetController,
		public router: Router
	) {}

	ngOnInit() {
		this.activeRoute.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/discover');
				return;
			}
			this.place = this.placesService.getPlace(paramMap.get('placeId'));
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
		console.log(mode);
		this.modalCtrl
			.create({
				component: CreateBookingComponent,
				componentProps: {
					data: this.place
				}
			})
			.then(modal => {
				modal.present();
				return modal.onDidDismiss();
			})
			.then(resulData => {
				if (resulData.role === 'confirm') {
					this.navCtrl.navigateBack('/places/tabs/discover');
				}
			});
	}
}
