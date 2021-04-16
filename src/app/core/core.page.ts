import { Component, OnInit } from '@angular/core';
import { FoodItem } from './models/item.model';
import { ManagerService } from './manager.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class CorePage implements OnInit {
  foods: FoodItem[];
  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.foods = this.managerService.foods;
  }

  get cartSize() {
    return this.managerService.cart.length;
  }
}
