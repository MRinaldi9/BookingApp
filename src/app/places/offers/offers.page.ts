import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.page.html',
	styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
	loadedOffers: Offer[];
	constructor(private offerService: OfferService) {}

	ngOnInit() {
		this.loadedOffers = this.offerService.offers;
	}
}
