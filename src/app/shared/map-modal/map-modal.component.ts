/// <reference types="@types/googlemaps"/>
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

interface Google {
  maps: typeof google.maps;
}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  constructor(
    private modalController: ModalController,
    private renderer: Renderer2
  ) {}

  ngOnInit() {}

  onCancel() {
    this.modalController.dismiss();
  }
  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then(googleMaps => {
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: { lat: 41.9040077, lng: 12.4838979 },
          zoom: 11
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apiGoogle}`;
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
