import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { first, tap, delay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class BookingService {
	constructor(private authService: AuthService) {}

	private _bookings = new BehaviorSubject<Booking[]>([]);

	get bookings() {
		return this._bookings.asObservable();
	}

	addBooking(
		placeId: string,
		placeTitle: string,
		placeImage: string,
		firstName: string,
		lastName: string,
		guestNumber: string,
		dateFrom: Date,
		dateTo: Date
	) {
		const newBooking: Booking = {
			id: Math.random.toString(),
			placeId,
			placeTitle,
			placeImage,
			firstName,
			lastName,
			guestNumber: +guestNumber,
			bookedFrom: dateFrom,
			bookedTo: dateTo,
			userId: this.authService.userId
		};

		return this.bookings.pipe(
			first(),
			delay(1000),
			tap(bookings => {
				this._bookings.next(bookings.concat(newBooking));
			})
		);
	}

	cancelBooking(bookingId: string) {
		return this.bookings.pipe(
			first(),
			delay(1000),
			tap(bookings => {
				this._bookings.next(
					bookings.filter(booking => booking.id !== bookingId)
				);
			})
		);
	}
}
