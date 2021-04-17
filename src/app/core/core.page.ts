import { Component, OnInit } from '@angular/core';
import { FoodItem } from './models/item.model';
import { ManagerService } from './manager.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class CorePage implements OnInit {
  categories: string[] = [];
  activeCategory: string;
  foods: FoodItem[] = [];
  foodsLoading = true;
  categoriesLoading = true;
  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    setTimeout(() => {
      this.categories = this.managerService.categories;
      this.activeCategory = this.categories[0];
      this.categoriesLoading = false;
      this.foods = this.managerService.getFoodsByCategory(0);
      this.foodsLoading = false;
    }, 800);
  }

  ionViewWillEnter() {
    // this.foods = this.managerService.foods;
    // this.categories = this.managerService.categories;
  }

  changeCategory(id: number) {
    // Prevents loading when reselecting the same category
    // tslint:disable-next-line: curly
    if (this.categories[id] === this.activeCategory) return;
    this.foodsLoading = true;
    this.activeCategory = this.categories[id];
    setTimeout(() => {
      this.foods = this.managerService.getFoodsByCategory(id);
      this.foodsLoading = false;
    }, 750);
  }

  get cartSize() {
    return this.managerService.cart.length;
  }

  // General UX method for image load using setTimeout for a delay
  handleImgLoad(e: any) {
    setTimeout(() => {
      const el = e.target as HTMLIonImgElement;
      const thumbN = el.parentElement.querySelector('ion-thumbnail');
      console.log(thumbN);

      thumbN.remove();
      el.classList.remove('invisible');
    }, 3000);
  }
}
