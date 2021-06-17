import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FoodItem, FoodItemInterface } from '../models/item.model';
import { ManagerService } from '../manager.service';
import { Cafe, CafeInterface } from '../models/cafe.model';
import { CartItem } from '../models/cartItem.model';
import { NavController } from '@ionic/angular';
import { tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
})
export class ItemPage implements OnInit {
  foodId: string;
  food: FoodItemInterface = null;
  // availableCafes: Cafe[] = null;
  quantity = 0;
  selectedCafe: CafeInterface = null;

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
      this.foodId = param.id;
      this.managerService
        .getFood(this.foodId)
        .pipe(take(1))
        .subscribe(
          (food) => {
            this.food = food;
            this.isLoading = false;
          },
          () => {
            this.navCtrl.navigateBack('/home');
          }
        );
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked(): void {
    const desc = this.elRef.nativeElement.querySelector(
      'div.desc'
    ) as HTMLDivElement;
    if (desc) {
      // Must be on the screen (loaded up)
      const span = desc.firstElementChild as HTMLSpanElement;
      const textHeight = span.offsetHeight;
      if (textHeight > desc.offsetHeight) {
        const wordList = span.textContent.trim().split(' ');
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

  selectCafe(cafe: CafeInterface) {
    this.selectedCafe = cafe;
  }

  isCafeSelected(cafe: CafeInterface) {
    // tslint:disable-next-line: curly
    if (!this.selectedCafe) return false;
    return cafe.id === this.selectedCafe.id;
  }

  foodExists(): boolean {
    return this.managerService.isFoodInCart(this.foodId);
  }

  safeToCart(): boolean {
    return (
      this.quantity > 0 && this.quantity < 100 && this.selectedCafe !== null
    );
  }

  addToCart() {
    this.managerService
      .addToCart(this.food, this.quantity, this.selectedCafe)
      .subscribe();
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
