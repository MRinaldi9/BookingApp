import { Injectable } from '@angular/core';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	private _places = new BehaviorSubject<Place[]>([
		new Place(
			'p1',
			'Manhattan Mansion',
			'In the heart of New York City',
			'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg',
			149.99,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			''
		),
		new Place(
			'p2',
			'Colosseum',
			'One of the seven wonders of the world',
			'https://www.cicerogo.com/itinerartis/wp-content/uploads/2017/09/Interno_Colosseo_04-e1536747707939.jpg',
			200,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			''
		),
		new Place(
			'p3',
			"Pisa's Tower",
			'Something',
			'https://staticfanpage.akamaized.net/wp-content/uploads/sites/12/2018/10/640px-torre_di_pisa_vista_dal_cortile_dellopera_del_duomo_06-638x425.jpg',
			200,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			''
		),
		new Place(
			'p2',
			'Colosseum',
			'One of the seven wonders of the world',
			'https://www.cicerogo.com/itinerartis/wp-content/uploads/2017/09/Interno_Colosseo_04-e1536747707939.jpg',
			200,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			''
		),
		new Place(
			'p3',
			"Pisa's Tower",
			'Something',
			'https://staticfanpage.akamaized.net/wp-content/uploads/sites/12/2018/10/640px-torre_di_pisa_vista_dal_cortile_dellopera_del_duomo_06-638x425.jpg',
			200,
			new Date('2019-01-01'),
			new Date('2019-12-31'),
			''
		)
	]);
	constructor(private authService: AuthService) {}

	get places(): Observable<Place[]> {
		return this._places.asObservable();
	}

	getPlace(id: string) {
		return this.places.pipe(
			take(1),
			map(places => {
				return { ...places.find(place => place.id === id) };
			})
		);
	}

	addPlace(
		title: string,
		description: string,
		price: number,
		dateFrom: Date,
		dateTo: Date
	) {
		const imageUrl =
			'https://www.cicerogo.com/itinerartis/wp-content/uploads/2017/09/Interno_Colosseo_04-e1536747707939.jpg';
		const newPlace = new Place(
			Math.random().toString(),
			title,
			description,
			imageUrl,
			price,
			dateFrom,
			dateTo,
			this.authService.userId
		);
		return this.places.pipe(
			take(1),
			delay(1000),
			tap(places => {
				this._places.next(places.concat(newPlace));
			})
		);
	}

	updatePlace(placeId: string, title: string, description: string) {
		return this.places.pipe(
			take(1),
			delay(1000),
			tap(places => {
				const updatedPlace = places.find(place => {
					return place.id === placeId;
				});
				updatedPlace.description = description;
				updatedPlace.title = title;
			})
		);
	}
}
