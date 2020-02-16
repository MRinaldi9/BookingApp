import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Booking } from '../shared/models/booking.model';
import { BookingService } from '../shared/services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  isLoading = false;
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

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(bookings => {
      this.isLoading = false;
      this.loadedBookings = bookings;
    });
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
