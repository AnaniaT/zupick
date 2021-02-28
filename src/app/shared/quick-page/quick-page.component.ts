import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quick-page',
  templateUrl: './quick-page.component.html',
  styleUrls: ['./quick-page.component.scss'],
})
export class QuickPageComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel', 'quickModal');
  }
}
