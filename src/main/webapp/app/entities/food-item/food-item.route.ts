import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { FoodItemComponent } from './food-item.component';
import { FoodItemDetailComponent } from './food-item-detail.component';
import { FoodItemPopupComponent } from './food-item-dialog.component';
import { FoodItemDeletePopupComponent } from './food-item-delete-dialog.component';

export const foodItemRoute: Routes = [
    {
        path: 'food-item',
        component: FoodItemComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'FoodItems'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'food-item/:id',
        component: FoodItemDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'FoodItems'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const foodItemPopupRoute: Routes = [
    {
        path: 'food-item-new',
        component: FoodItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'FoodItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'food-item/:id/edit',
        component: FoodItemPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'FoodItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'food-item/:id/delete',
        component: FoodItemDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'FoodItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
