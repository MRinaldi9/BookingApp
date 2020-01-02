import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.page.html',
	styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
	loadedBookings: Booking[];

	constructor(
		private menuCtrl: MenuController,
		private bookingService: BookingService
	) {}

	ngOnInit() {
		this.loadedBookings = this.bookingService.bookings;
	}

	openMenu() {
		this.menuCtrl.open('m1');
	}
}
