import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FoodItem } from './food-item.model';
import { FoodItemService } from './food-item.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-food-item',
    templateUrl: './food-item.component.html'
})
export class FoodItemComponent implements OnInit, OnDestroy {
foodItems: FoodItem[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private foodItemService: FoodItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.foodItemService.query().subscribe(
            (res: HttpResponse<FoodItem[]>) => {
                this.foodItems = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInFoodItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: FoodItem) {
        return item.id;
    }
    registerChangeInFoodItems() {
        this.eventSubscriber = this.eventManager.subscribe('foodItemListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
