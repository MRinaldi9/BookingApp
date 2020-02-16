import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../../shared/models/place.model';
import { AuthService } from '../../../shared/services/auth.service';
import { BookingService } from '../../../shared/services/booking.service';
import { PlacesService } from '../../../shared/services/places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placesSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private activeRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}
  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.activeRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placesSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.place = place;
            this.isBookable = place.userId !== this.authService.userId;
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'An error occured!',
                message: 'Could not load the place',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.navCtrl.navigateBack(['/places/tabs/discover']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
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
      .then(resultData => {
        if (resultData.role === 'confirm') {
          this.loadingController
            .create({
              message: 'Booking Placing...',
              spinner: 'dots'
            })
            .then(loadingEl => {
              loadingEl.present();
              const dataDialog = resultData.data.bookingData;
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  dataDialog.firstName,
                  dataDialog.lastName,
                  dataDialog.guestNumber,
                  new Date(dataDialog.dateFrom),
                  new Date(dataDialog.dateTo)
                )
                .subscribe(_ => {
                  loadingEl.dismiss();
                  this.navCtrl.navigateBack('/places/tabs/discover');
                });
            });
        }
      });
  }
}
