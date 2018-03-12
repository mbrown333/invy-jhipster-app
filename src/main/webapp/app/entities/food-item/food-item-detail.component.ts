import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { FoodItem } from './food-item.model';
import { FoodItemService } from './food-item.service';

@Component({
    selector: 'jhi-food-item-detail',
    templateUrl: './food-item-detail.component.html'
})
export class FoodItemDetailComponent implements OnInit, OnDestroy {

    foodItem: FoodItem;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private foodItemService: FoodItemService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFoodItems();
    }

    load(id) {
        this.foodItemService.find(id)
            .subscribe((foodItemResponse: HttpResponse<FoodItem>) => {
                this.foodItem = foodItemResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFoodItems() {
        this.eventSubscriber = this.eventManager.subscribe(
            'foodItemListModification',
            (response) => this.load(this.foodItem.id)
        );
    }
}
