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
  expirationOptions: any[] = [
    { value: 1, label: '1 month' },
    { value: 3, label: '3 months' },
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' }
  ];
  selectedExpiration: any;

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
    const options = { expiration: this.selectedExpiration.value, category: this.selectedCategory ? this.selectedCategory.id : '' };
    this.foodItemService.queryExpiration(options).subscribe(
      (res: HttpResponse<FoodItem[]>) => {
          this.foodItems = res.body;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnInit() {
    this.selectedCategory = null;
    this.selectedExpiration = this.expirationOptions[0];
    this.loadAllCategories();
    this.loadItems();
  }

  onChange(event) {
    this.loadItems();
  }

  private onError(error) {
    this.jhiAlertService.error(error.message, null, null);
  }

}
