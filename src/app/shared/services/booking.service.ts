import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { APIURL } from 'src/app/apiURL';

import { Booking } from '../models/booking.model';
import { BookingData } from '../models/bookingData.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  fetchBookings() {
    return this.http
      .get<BookingData>(
        `${APIURL.apiUrlDb}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
      )
      .pipe(
        map(bookingsData => {
          const bookings: Booking[] = [];
          for (const key in bookingsData) {
            if (bookingsData.hasOwnProperty(key)) {
              bookings.push({
                id: key,
                firstName: bookingsData[key].firstName,
                guestNumber: bookingsData[key].guestNumber,
                lastName: bookingsData[key].lastName,
                placeImage: bookingsData[key].placeImage,
                placeId: bookingsData[key].placeId,
                userId: bookingsData[key].placeId,
                placeTitle: bookingsData[key].placeTitle,
                bookedFrom: new Date(bookingsData[key].bookedFrom),
                bookedTo: new Date(bookingsData[key].bookedTo)
              } as Booking);
            }
          }
          return bookings;
        }),
        tap(bookings => this._bookings.next(bookings))
      );
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
    let generatedId: string;
    const newBooking: Booking = {
      id: '',
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
    return this.http
      .post<Booking>(`${APIURL.apiUrlDb}/bookings.json`, {
        ...newBooking,
        id: null
      } as Booking)
      .pipe(
        switchMap(respData => {
          generatedId = respData.id;
          return this.bookings;
        }),
        first(),
        tap(bookings => {
          newBooking.id = generatedId;
          this._bookings.next(bookings.concat(newBooking));
        })
      );
  }

  cancelBooking(bookingId: string) {
    return this.http
      .delete(`${APIURL.apiUrlDb}/bookings/${bookingId}.json`)
      .pipe(
        switchMap(_ => this.bookings),
        first(),
        tap(bookings => {
          this._bookings.next(
            bookings.filter(booking => booking.id !== bookingId)
          );
        })
      );
  }
}
