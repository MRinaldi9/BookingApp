import { Component, OnInit, OnDestroy } from '@angular/core';
import {
	MenuController,
	IonItemSliding,
	LoadingController
} from '@ionic/angular';
import { BookingService } from '../services/booking.service';
import { Booking } from '../models/booking.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.page.html',
	styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
	loadedBookings: Booking[];
	private bookingsSub: Subscription;

	constructor(
		private menuCtrl: MenuController,
		private bookingService: BookingService,
		private loadingController: LoadingController
	) {}

	ngOnDestroy(): void {
		if (this.bookingsSub) {
			this.bookingsSub.unsubscribe();
		}
	}

	ngOnInit() {
		this.bookingsSub = this.bookingService.bookings.subscribe(
			bookings => (this.loadedBookings = bookings)
		);
	}

	openMenu() {
		this.menuCtrl.open('m1');
	}

	onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
		slidingItem.close();
		this.loadingController
			.create({
				message: 'Removing Booking...',
				spinner: 'dots'
			})
			.then(loadingEl => {
				loadingEl.present();
				this.bookingService.cancelBooking(bookingId).subscribe(_ => {
					loadingEl.dismiss();
				});
			});
	}
}
