import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';

import { Category } from '../entities/category/category.model';
import { CategoryService } from '../entities/category/category.service';
import { FoodItem } from '../entities/food-item/food-item.model';
import { FoodItemService } from '../entities/food-item/food-item.service';

@Component({
  selector: 'jhi-expiration',
  templateUrl: './expiration.component.html',
  styles: []
})
export class ExpirationComponent implements OnInit {
  categories: Category[];
  foodItems: FoodItem[];
  selectedCategory: Category;

  constructor(
    private categoryService: CategoryService,
    private foodItemService: FoodItemService,
    private jhiAlertService: JhiAlertService
  ) { }

  loadAllCategories() {
    this.categoryService.query().subscribe(
        (res: HttpResponse<Category[]>) => {
            this.categories = res.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  loadItems() {
    this.foodItemService.queryExpiration({ expiration: 1 }).subscribe(
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
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

}
