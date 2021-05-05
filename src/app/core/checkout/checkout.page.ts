import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderModalComponent } from 'src/app/shared/order-modal/order-modal.component';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  isLoading = true;

  @ViewChild('map') mapElementRef: ElementRef;
  // lat 7.047185, lng 38.478741 Around Atnet SHopping Blg
  centerCoords = { lat: 7.047185, lng: 38.478741 };

  private googleMaps: any;
  private clickListener: any;
  private map: any;
  private marker: any;

  constructor(
    private renderer: Renderer2,
    private modalCtrl: ModalController,
    private managerService: ManagerService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getGoogleMaps()
      .then((googleMaps) => {
        // googleMaps is actually the object returned from google maps api script
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new this.googleMaps.Map(mapEl, {
          center: this.centerCoords,
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
        // Will fire when loading the map finishes
        this.googleMaps.event.addListenerOnce(this.map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
          this.isLoading = false;
        });

        // Pass coodinate values after a click on the map
        this.clickListener = this.map.addListener('click', (ev) => {
          this.locationPicked(ev.latLng.lat(), ev.latLng.lng());
        });
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
      animation: this.googleMaps.Animation.DROP,
      position: { lat, lng },
      title: 'Your location',
    });

    this.openModal({ lat, lng });
  }

  private openModal(location: { lat: number; lng: number }) {
    this.modalCtrl
      .create({
        component: OrderModalComponent,
        showBackdrop: true,
        cssClass: 'order-modal',
      })
      .then((modal) => {
        modal.onDidDismiss().then(({ role }) => {
          if (role === 'ordered') {
            return this.managerService.finishOrder(location);
          }
        });
        return modal.present();
      });
  }

  ionViewWillLeave() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
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
