/// <reference types="@types/googlemaps"/>
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { APIURL } from '../../apiURL';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { PlaceLocation } from '../models/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImg: string;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalController
      .create({
        component: MapModalComponent
      })
      .then(modalEl => {
        modalEl.onDidDismiss().then(modalData => {
          if (!modalData.data) {
            return;
          }
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null
          };
          this.getAddress(modalData.data.lat, modalData.data.lng)
            .pipe(
              switchMap(address => {
                pickedLocation.address = address;
                return of(
                  this.getMapImage(pickedLocation.lat, pickedLocation.lng, 15)
                );
              })
            )
            .subscribe(staticImageUrl => {
              pickedLocation.staticMapImageUrl = staticImageUrl;
              this.selectedLocationImg = staticImageUrl;
              this.locationPick.emit(pickedLocation);
            });
        });
        modalEl.present();
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `${APIURL.apiUrlReverseGeoCoding}` +
          `${lat},${lng}&key=${APIURL.apiKeyGoogle}`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length <= 0) {
            return;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}
            &size=500x300&maptype=hybrid&markers=color:red%7Clabel:Location%7C${lat},${lng}&key=${APIURL.apiKeyGoogle}`;
  }
}
