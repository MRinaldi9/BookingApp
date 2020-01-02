import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PlacesService } from '../../../services/places.service';
import { ActivatedRoute } from '@angular/router';
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
		private route: ActivatedRoute,
		private modalCtrl: ModalController
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe(paramMap => {
			if (!paramMap.has('placeId')) {
				this.navCtrl.navigateBack('/places/tabs/discover');
				return;
			}
			this.place = this.placesService.getPlace(paramMap.get('placeId'));
		});
	}
	onBookPlace() {
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
					console.log(resulData.data);
				}
			});
	}
}
