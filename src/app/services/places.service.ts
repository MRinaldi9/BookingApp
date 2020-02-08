import { Injectable } from '@angular/core';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OfferedPlaces } from '../models/offeredPlaces.model';

@Injectable({
	providedIn: 'root'
})
export class PlacesService {
	private _places = new BehaviorSubject<Place[]>([]);
	constructor(private authService: AuthService, private http: HttpClient) {}

	get places(): Observable<Place[]> {
		return this._places.asObservable();
	}

	fetchPlaces(): Observable<Place[]> {
		return this.http
			.get<OfferedPlaces>(`${environment.apiUrl}/offered-places.json`)
			.pipe(
				map(resData => {
					const places: Place[] = [];
					for (const key in resData) {
						if (resData.hasOwnProperty(key)) {
							resData[key].id = key;
							places.push(resData[key]);
						}
					}
					return places;
				}),
				tap(places => {
					this._places.next(places);
				})
			);
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
		let generatedId = null;

		const newPlace = new Place(
			null,
			title,
			description,
			imageUrl,
			price,
			dateFrom,
			dateTo,
			this.authService.userId
		);
		return this.http
			.post<{ name: string }>(`${environment.apiUrl}/offered-places.json`, {
				...newPlace
			})
			.pipe(
				switchMap(respData => {
					generatedId = respData.name;
					return this.places;
				}),
				first(),
				tap(places => {
					newPlace.id = generatedId;
					this._places.next(places.concat(newPlace));
				})
			);
	}

	updatePlace(placeId: string, title: string, description: string) {
		let placeToUpdate: Place;
		return this.places.pipe(
			first(),
			switchMap<Place[], Observable<Place>>(places => {
				placeToUpdate = places.find(place => {
					return place.id === placeId;
				});
				placeToUpdate.description = description;
				placeToUpdate.title = title;
				return this.http.put<Place>(
					`${environment.apiUrl}/offered-places/${placeId}.json`,
					{ ...placeToUpdate, id: null }
				);
			}),
			tap(place => {
				const actualPlaces = this._places.value;
				this._places.next(actualPlaces.concat(place));
			})
		);
	}
}
