import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private managerService: ManagerService,
    private navCtrl: NavController,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.isLoading = true;
      // Make sure that the param.id is all numbers
      if (/^[0-9]+$/.test(param.id)) {
        this.foodId = +param.id;
        return setTimeout(() => {
          this.food = this.managerService.getFood(this.foodId);
          this.availableCafes = this.managerService.getAvailableCafes(
            this.foodId
          );
          this.isLoading = false;
        }, 800);
      }
      this.router.navigateByUrl('/home');
    });
  }

  ngAfterViewChecked(): void {
    const desc = this.elRef.nativeElement.querySelector(
      'div.desc'
    ) as HTMLDivElement;
    if (desc) {
      // Must be on the screen (loaded up)
      let span = desc.firstElementChild as HTMLSpanElement;
      let textHeight = span.offsetHeight;
      if (textHeight > desc.offsetHeight) {
        let wordList = span.textContent.trim().split(' ');
        wordList.pop();
        wordList.pop();
        span.textContent = wordList.join(' ') + '...';
      } else {
        span.textContent = this.food.desc;
      }
    }
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

  // General UX method for image load using setTimeout for a delay
  handleImgLoad(e: any) {
    setTimeout(() => {
      const el = e.target as HTMLIonImgElement;
      const thumbN = el.parentElement.querySelector('ion-skeleton-text');
      // tslint:disable-next-line: curly
      if (thumbN) thumbN.remove();
      el.classList.remove('invisible');
    }, 3000);
  }
}
