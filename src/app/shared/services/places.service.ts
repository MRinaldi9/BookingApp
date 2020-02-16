import { Injectable } from '@angular/core';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, switchMap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OfferedPlaces } from '../models/offeredPlaces.model';
import { ApiURL } from 'src/app/apiURL';

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
      .get<OfferedPlaces>(`${ApiURL.APIURLDB}/offered-places.json`)
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
    return this.http
      .get<Place>(`${ApiURL.APIURLDB}/offered-places/${id}.json`)
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
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
      .post<{ name: string }>(`${ApiURL.APIURLDB}/offered-places.json`, {
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
    let updatedPlaces: Place[];
    return this.places.pipe(
      first(),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(
          place => place.id === placeId
        );
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        return this.http.put(
          `${ApiURL.APIURLDB}/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(_ => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
