import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

@Injectable({
	providedIn: 'root'
})
export class BookingService {
	private _bookings: Booking[] = [
		{
			id: 'xyz',
			placeId: 'p1',
			placeTitle: 'Manhattan Mansion',
			guestNumber: 3,
			userId: 'abc'
		}
	];
	get bookings() {
		return [...this._bookings];
	}
}
