import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FoodItem } from './food-item.model';
import { FoodItemPopupService } from './food-item-popup.service';
import { FoodItemService } from './food-item.service';
import { User } from '../../shared';
import { Category, CategoryService } from '../category';

@Component({
    selector: 'jhi-food-item-dialog',
    templateUrl: './food-item-dialog.component.html'
})
export class FoodItemDialogComponent implements OnInit {

    foodItem: FoodItem;
    isSaving: boolean;

    categories: Category[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private foodItemService: FoodItemService,
        private categoryService: CategoryService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.categoryService.query()
            .subscribe((res: HttpResponse<Category[]>) => { this.categories = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.foodItem.id !== undefined) {
            this.subscribeToSaveResponse(
                this.foodItemService.update(this.foodItem));
        } else {
            this.subscribeToSaveResponse(
                this.foodItemService.create(this.foodItem));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<FoodItem>>) {
        result.subscribe((res: HttpResponse<FoodItem>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: FoodItem) {
        this.eventManager.broadcast({ name: 'foodItemListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    trackCategoryById(index: number, item: Category) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-food-item-popup',
    template: ''
})
export class FoodItemPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private foodItemPopupService: FoodItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.foodItemPopupService
                    .open(FoodItemDialogComponent as Component, params['id']);
            } else {
                this.foodItemPopupService
                    .open(FoodItemDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
