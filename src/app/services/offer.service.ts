import { Injectable } from '@angular/core';
import { Offer } from '../models/offer.model';

@Injectable({
	providedIn: 'root'
})
export class OfferService {
	private _offers: Offer[] = [
		{
			id: 'o1',
			place: 'Rome',
			price: 200,
			description: 'Caput Mundi'
		},
		{
			id: 'o2',
			place: 'Paris',
			price: 300,
			description: 'No Bidet'
		}
	];
	constructor() {}

	get offers() {
		return [...this._offers];
	}
}
