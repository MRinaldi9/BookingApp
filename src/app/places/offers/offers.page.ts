import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Place } from '../../shared/models/place.model';
import { PlacesService } from '../../shared/services/places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Place[];
  isLoading = false;
  private placesSub: Subscription;
  constructor(
    private placesService: PlacesService,
    private menuCtrl: MenuController,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(
      offers => (this.loadedOffers = offers)
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(_ => {
      this.isLoading = false;
    });
  }
  openMenu() {
    this.menuCtrl.toggle('m1');
  }
  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl(`/places/tabs/offers/edit/${id}`);
  }
}
