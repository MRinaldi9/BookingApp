/// <reference types="@types/googlemaps"/>
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  OnDestroy,
  Input
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { APIURL } from 'src/app/apiURL';

interface Google {
  maps: typeof google.maps;
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() mapCenter = { lat: 41.9040077, lng: 12.4838979 };
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  private _mapEventListener: any;
  constructor(
    private modalController: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}
  ngOnDestroy(): void {
    if (this._mapEventListener) {
      this._mapEventListener.remove();
    }
  }

  onCancel() {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    this.getGoogleMaps()
      .then(googleMaps => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.mapCenter,
          zoom: 11
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
        if (this.selectable) {
          this._mapEventListener = map.addListener('click', googleEvent => {
            const coords = {
              lat: googleEvent.latLng.lat(),
              lng: googleEvent.latLng.lng()
            };
            this.modalController.dismiss(coords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.mapCenter,
            map,
            title: 'Picked Location'
          });
          marker.setMap(map);
        }
      })
      .catch(err => console.log(err));
  }

  private getGoogleMaps() {
    const win = window as any;
    const googleModule: Google = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise<Google['maps']>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${APIURL.apiKeyGoogle}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const googleModuleLoaded: Google = win.google;
        if (googleModuleLoaded && googleModuleLoaded.maps) {
          resolve(googleModuleLoaded.maps);
        } else {
          reject('Google maps SDK not available');
        }
      };
    });
  }
}
