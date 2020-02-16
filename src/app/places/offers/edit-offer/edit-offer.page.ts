import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../../shared/models/place.model';
import { PlacesService } from '../../../shared/services/places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  placeId: string;
  isLoading = false;
  private placesSub: Subscription;
  constructor(
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placesSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.minLength(2)]
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertController
              .create({
                header: 'An error occured',
                message: 'Place could not be fetched. Please try again later',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.navCtrl.navigateBack('/places/tabs/offers');
                    }
                  }
                ]
              })
              .then(alertElement => {
                alertElement.present();
              });
          }
        );
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController
      .create({
        message: 'Updating Offer...',
        spinner: 'dots'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService
          .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description
          )
          .subscribe(places => {
            loadingEl.dismiss();
            this.navCtrl.navigateBack('/places/tabs/offers');
          });
      });
  }
}
