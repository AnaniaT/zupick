import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
  Input,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrderModalComponent } from '../order-modal/order-modal.component';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() centerCoords: { lat: number; lng: number; mark: boolean };
  @Input() modalTitle: string;
  @Input() isCheckout: boolean;

  private googleMaps: any;
  private clickListener: any;
  private map: any;
  private marker: any;

  isLoading = true;

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  ngAfterViewInit() {
    this.getGoogleMaps()
      .then((googleMaps) => {
        // googleMaps is actually the object returned from google maps api script
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const { lat, lng } = this.centerCoords;
        const map = new googleMaps.Map(mapEl, {
          // Defaults around St. Gabriel Church,
          center: {
            lat,
            lng,
          },
          zoom: 16,
          // minZoom: 10,
          // maxZoom: 20,
          // map limited to on Awassa
          restriction: {
            latLngBounds: {
              east: 38.52014,
              north: 7.1,
              south: 7.01,
              west: 38.45488,
            },
            strictBounds: true,
          },
          zoomControl: true,
          scaleControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        this.map = map;

        if (this.centerCoords.mark) {
          // Add marker to the center (previously selected place)
          this.marker = new googleMaps.Marker({
            map,
            // animation: googleMaps.Animation.DROP,
            position: { lat, lng },
            title: 'Delivery Location',
          });
        }

        // Will fire when loading the map finishes
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
          this.isLoading = false;
        });

        if (this.isCheckout) {
          // Pass coodinate values after a click on the map
          this.clickListener = map.addListener('click', (ev) => {
            this.locationPicked(ev.latLng.lat(), ev.latLng.lng());
          });
        }
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  private locationPicked(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new this.googleMaps.Marker({
      map: this.map,
      // animation: this.googleMaps.Animation.DROP,
      position: { lat, lng },
      title: 'Your location',
    });

    this.openModal({ lat, lng });
  }

  private openModal(location: { lat: number; lng: number }) {
    this.modalCtrl
      .create({
        id: 'order-modal',
        component: OrderModalComponent,
        showBackdrop: true,
        cssClass: 'order-modal',
      })
      .then((modal) => {
        modal.onDidDismiss().then(({ role }) => {
          if (role === 'ordered') {
            this.modalCtrl.dismiss(location, 'done', 'checkout-modal');
          }
        });
        return modal.present();
      });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`; // &callback=initMap
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        const err = new HttpErrorResponse({ status: 0 });
        console.log(err);
      };
      // Interaction with the DOM directly is not always good, appending to an Angular controlled DOM area is not recomended
      // This time we are adding to the root of page.html in which angular only has right on the app-root component
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available');
        }
      };
    });
  }
}
