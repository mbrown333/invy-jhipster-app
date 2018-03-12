import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { FoodItem } from './food-item.model';
import { FoodItemPopupService } from './food-item-popup.service';
import { FoodItemService } from './food-item.service';

@Component({
    selector: 'jhi-food-item-delete-dialog',
    templateUrl: './food-item-delete-dialog.component.html'
})
export class FoodItemDeleteDialogComponent {

    foodItem: FoodItem;

    constructor(
        private foodItemService: FoodItemService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.foodItemService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'foodItemListModification',
                content: 'Deleted an foodItem'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-food-item-delete-popup',
    template: ''
})
export class FoodItemDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private foodItemPopupService: FoodItemPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.foodItemPopupService
                .open(FoodItemDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
