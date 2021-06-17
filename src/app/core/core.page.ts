import { Component, OnInit } from '@angular/core';
import { ManagerService } from './manager.service';
import { switchMap, take, map, tap } from 'rxjs/operators';

import { FoodItemInterface } from './models/item.model';
import { Category } from './models/category.model';

@Component({
  selector: 'app-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class CorePage implements OnInit {
  categories: Category[] = [];
  activeCategory: Category;
  foods: FoodItemInterface[] = [];
  foodsLoading = true;
  categoriesLoading = true;

  cartSize = 0;

  isSearched = false;
  searchItems: FoodItemInterface[] = [];
  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.managerService.cart.subscribe((cart) => {
      this.cartSize = cart.length;
    });

    // MAYBE TRY HOOKING THE CATEGORIES TO UPDATE NEAR REAL TIME
    // HYPTHESIS: REMOVE THE take(1) AND USE THE pollInterval PROP ON APOLLO watchQuery
    this.managerService.categories
      .pipe(
        take(1),
        switchMap((categories) => {
          this.categoriesLoading = true;
          this.foodsLoading = true;

          this.categories = categories;
          this.activeCategory = this.categories[0];
          return this.managerService.getFoodsByCategory(this.activeCategory.id);
        }),
        take(1),
        map((foods) => {
          this.foods = foods;
          this.categoriesLoading = false;
          this.foodsLoading = false;
        })
      )
      .subscribe();
  }

  changeCategory(id: string) {
    // Prevents loading when reselecting the same category
    // tslint:disable-next-line: curly
    if (id === this.activeCategory.id) return;
    this.foodsLoading = true;
    this.activeCategory = this.categories.find((c) => c.id === id);
    this.managerService
      .getFoodsByCategory(this.activeCategory.id)
      .pipe(
        take(1),
        map((foods) => {
          this.foods = foods;
          this.foodsLoading = false;
        })
      )
      .subscribe();
    // setTimeout(() => {
    //   this.foods = this.managerService.getFoodsByCategory(id);
    //   this.foodsLoading = false;
    // }, 750);
  }

  // get cartSize() {
  //   return this.managerService.cart.length;
  // }

  // General UX method for image load using setTimeout for a delay
  handleImgLoad(e: any) {
    setTimeout(() => {
      const el = e.target as HTMLIonImgElement;
      const thumbN = el.parentElement.querySelector('ion-thumbnail');

      thumbN.remove();
      el.classList.remove('invisible');
    }, 3000);
  }

  onSearchFood(e: any) {
    this.foodsLoading = true;
    this.isSearched = true;
    const searchTerm = e.target.value;
    this.managerService
      .searchFood(searchTerm)
      .pipe(
        take(1),
        tap((searchItems) => {
          this.searchItems = searchItems;
          this.foodsLoading = false;
        })
      )
      .subscribe();
    // const searchTerm = e.target.value;
    // setTimeout(() => {
    //   this.searchItems = this.managerService.searchFood(searchTerm);
    //   this.foodsLoading = false;
    // }, 750);
  }

  onSearchCancel() {
    if (this.isSearched) {
      this.isSearched = false;
      this.searchItems = [];
    }
  }
}
