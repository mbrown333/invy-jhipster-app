import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Category } from '../entities/category/category.model';
import { CategoryService } from '../entities/category/category.service';
import { FoodItem } from '../entities/food-item/food-item.model';
import { FoodItemService } from '../entities/food-item/food-item.service';
import { Principal } from '../shared';

@Component({
  selector: 'jhi-category-list',
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[];
  foodItems: FoodItem[];
  selectedCategory: Category;
  currentAccount: any;
  eventSubscriber: Subscription;
  eventFoodSubscriber: Subscription;

  constructor(
    private categoryService: CategoryService,
    private foodItemService: FoodItemService,
    private jhiAlertService: JhiAlertService,
    private eventManager: JhiEventManager,
    private principal: Principal
  ) {
  }

  loadAllCategories() {
    this.categoryService.query().subscribe(
        (res: HttpResponse<Category[]>) => {
            this.categories = res.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadItems() {
    this.foodItemService.query().subscribe(
      (res: HttpResponse<FoodItem[]>) => {
          this.foodItems = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadItemsByCategory() {
    this.foodItemService.query({ category: this.selectedCategory.id }).subscribe(
      (res: HttpResponse<FoodItem[]>) => {
          this.foodItems = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.selectedCategory = null;
    this.loadAllCategories();
    this.loadItems();
    this.principal.identity().then((account) => {
        this.currentAccount = account;
    });
    this.registerChangeInCategories();
    this.registerChangeInFoodItems();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  registerChangeInCategories() {
    this.eventSubscriber = this.eventManager.subscribe('categoryListModification', (response) => {
      this.loadAllCategories();
      this.onChange({});
    });
  }

  registerChangeInFoodItems() {
    this.eventFoodSubscriber = this.eventManager.subscribe('foodItemListModification', (response) => this.onChange({}));
  }

  onChange(event) {
    if (!this.selectedCategory) {
      this.loadItems();
      return;
    }

    this.loadItemsByCategory();
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

}
