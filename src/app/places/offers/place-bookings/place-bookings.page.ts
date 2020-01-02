import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'app-place-bookings',
	templateUrl: './place-bookings.page.html',
	styleUrls: ['./place-bookings.page.scss']
})
export class PlaceBookingsPage implements OnInit {
	constructor(private navCtrl: NavController) {}

	ngOnInit() {}

	onBookPlace() {
		this.navCtrl.navigateBack('/places/tabs/offers');
	}
}
