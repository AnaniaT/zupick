import { Component, OnInit } from '@angular/core';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import {
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { OrderInterface, Coordinates, Order } from '../../order.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  private centerCoords = {
    lat: 7.046202640188957,
    lng: 38.478706128043996,
    mark: false,
  };

  private toast: HTMLIonToastElement;

  formStep = 0;

  private orderObj: OrderInterface | any = {};

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    // this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    // this.onShowMap();
  }

  clickHandler(isDropPlace: number) {
    if (isDropPlace === this.formStep) {
      if (isDropPlace !== 2) {
        return this.onShowMap();
      }
      this.deliveryDesc();
    }
  }

  onMoreInfo() {
    this.alertCtrl
      .create({
        header: 'How To Make An Order',
        message: `
        The form requires user to fill it according to the color indicators. That is:</br>
            - Blue: previous form field(s) must be finished before procceding to this one.</br>
            - Green: user has already provided the nesseccary data to this form field.</br>
            - None (no overlay): the form field is waiting for user to provide the required information.</br>
            `,
        backdropDismiss: true,
        buttons: ['Got It'],
      })
      .then((alertEl) => alertEl.present());
  }

  private onShowMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          centerCoords: this.centerCoords,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        this.presentToast();
        return modalEl.onDidDismiss();
      })
      .then((modalInfo) => {
        this.toast.dismiss();
        if (modalInfo.role !== 'picked') {
          return;
        }

        switch (this.formStep) {
          case 0:
            this.pickupPlace(modalInfo.data);
            break;
          case 1:
            this.dropplace(modalInfo.data);
            break;
          default:
            console.log('Something went worng');
            break;
        }
      });
  }

  private pickupPlace(coords: Coordinates) {
    this.alertCtrl
      .create({
        message:
          'Enter the name of the Pickup Place you just referenced on the map.',
        backdropDismiss: false,
        inputs: [
          {
            name: 'placeName',
            type: 'text',
            placeholder: 'eg. Eshetu Building, Piassa',
          },
        ],
        buttons: [
          {
            text: 'Submit',
            handler: (alertData) => {
              // Could also validate here more thoroughly
              if (alertData.placeName) {
                this.orderObj.pickupPlace = {
                  name: alertData.placeName,
                  location: coords,
                };
                this.formStep = 1;
                return true;
              }
              console.log('Please enter the name');
              return false;
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  private dropplace(coords: Coordinates) {
    this.alertCtrl
      .create({
        message: 'Enter the name of the Drop Place you picked on the map.',
        backdropDismiss: false,
        inputs: [
          {
            name: 'placeName',
            type: 'text',
            placeholder: 'eg. Home',
          },
        ],
        buttons: [
          {
            text: 'Submit',
            handler: (alertData) => {
              // Could also validate here more thoroughly
              if (alertData.placeName) {
                this.orderObj.dropPlace = {
                  name: alertData.placeName,
                  location: coords,
                };
                this.formStep = 2;
                return true;
              }
              console.log('Please enter the name');
              return false;
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  private deliveryDesc() {
    this.alertCtrl
      .create({
        message:
          'Please list out the items you want to be delivered with their corresponding quantity.',
        backdropDismiss: false,
        inputs: [
          {
            name: 'desc',
            type: 'textarea',
            placeholder: 'eg. Mango Juice x2, Special Pancake x1',
          },
        ],
        buttons: [
          {
            text: 'Submit',
            handler: (alertData) => {
              // Could also validate here more thoroughly
              if (alertData.desc) {
                this.orderObj.desc = alertData.desc;
                this.finishOrder();
                this.router.navigate(['/home', 'ongoing']);
                return true;
              }
              console.log('Please enter the name');
              return false;
            },
          },
        ],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  private async presentToast() {
    let toastObj;
    if (this.formStep === 0) {
      toastObj = {
        message: 'Locate Pickup Place',
        alertInfo: {
          header: 'Pickup Place',
          message: 'This should be the place where your delivery is found.',
        },
      };
    } else if (this.formStep === 1) {
      toastObj = {
        message: 'Locate Drop Place',
        alertInfo: {
          header: 'Drop Place',
          message:
            'This should be the place where your delivery is handed to you.',
        },
      };
    } else {
      return console.log('Something went wrong');
    }

    const toast = await this.toastCtrl.create({
      message: toastObj.message,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          icon: 'information-circle-outline',
          handler: () => {
            this.alertCtrl
              .create({
                header: toastObj.alertInfo.header,
                message: toastObj.alertInfo.message,
                backdropDismiss: true,
                buttons: [
                  {
                    text: 'Okay',
                    role: 'cancel',
                    handler: () => {
                      this.presentToast();
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          },
        },
      ],
    });
    this.toast = toast;
    this.toast.present();
  }

  private finishOrder() {
    let o: OrderInterface = this.orderObj;
    const order = new Order(o.pickupPlace, o.dropPlace, o.desc);
    console.log(order);
  }
}
