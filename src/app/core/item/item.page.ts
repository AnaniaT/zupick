import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodItem } from '../models/item.model';
import { ManagerService } from '../manager.service';
import { Cafe } from '../models/cafe.model';
import { CartItem } from '../models/cartItem.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  foodId: number;
  food: FoodItem = null;
  availableCafes: Cafe[] = null;
  quantity = 0;
  cafe: Cafe = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      try {
        this.foodId = +param.id;
        // Forward to cart page if item already exists (may be bad UX)
        // if (this.managerService.isFoodInCart(this.foodId)) {
        //   this.navCtrl.pop();
        //   return this.router.navigateByUrl('/home/cart');
        // }
        this.food = this.managerService.getFood(this.foodId);
        this.availableCafes = this.managerService.getAvailableCafes(
          this.foodId
        );
      } catch (e) {
        console.log(e);
        this.router.navigateByUrl('/home');
      }
    });
  }

  alterQuantity(action: '+' | '-') {
    if (action === '+' && this.quantity < 99) {
      this.quantity++;
    }
    if (action === '-' && this.quantity > 0) {
      this.quantity--;
    }
  }

  cafeSelect(cafeId: string | number) {
    this.cafe = this.managerService.getCafe(cafeId);
  }

  isCafeSelected(id: number): boolean {
    if (this.cafe) {
      return this.cafe.id === id;
    }
    return false;
  }

  foodExists(): boolean {
    return this.managerService.isFoodInCart(this.foodId);
  }

  safeToCart(): boolean {
    return this.quantity > 0 && this.quantity < 100 && this.cafe !== null;
  }

  addToCart() {
    this.managerService.addToCart(this.food, this.quantity, this.cafe);
    // this.router.navigateByUrl('/home/cart');
  }
}
