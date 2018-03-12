import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FoodItem } from './food-item.model';
import { FoodItemService } from './food-item.service';

@Injectable()
export class FoodItemPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private foodItemService: FoodItemService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.foodItemService.find(id)
                    .subscribe((foodItemResponse: HttpResponse<FoodItem>) => {
                        const foodItem: FoodItem = foodItemResponse.body;
                        foodItem.created = this.datePipe
                            .transform(foodItem.created, 'yyyy-MM-ddTHH:mm:ss');
                        foodItem.expiration = this.datePipe
                            .transform(foodItem.expiration, 'yyyy-MM-dd');
                        this.ngbModalRef = this.foodItemModalRef(component, foodItem);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.foodItemModalRef(component, new FoodItem());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    foodItemModalRef(component: Component, foodItem: FoodItem): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.foodItem = foodItem;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
