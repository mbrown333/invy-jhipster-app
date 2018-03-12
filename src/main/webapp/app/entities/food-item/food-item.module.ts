import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PantryAppSharedModule } from '../../shared';
import { PantryAppAdminModule } from '../../admin/admin.module';
import {
    FoodItemService,
    FoodItemPopupService,
    FoodItemComponent,
    FoodItemDetailComponent,
    FoodItemDialogComponent,
    FoodItemPopupComponent,
    FoodItemDeletePopupComponent,
    FoodItemDeleteDialogComponent,
    foodItemRoute,
    foodItemPopupRoute,
} from './';

const ENTITY_STATES = [
    ...foodItemRoute,
    ...foodItemPopupRoute,
];

@NgModule({
    imports: [
        PantryAppSharedModule,
        PantryAppAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        FoodItemComponent,
        FoodItemDetailComponent,
        FoodItemDialogComponent,
        FoodItemDeleteDialogComponent,
        FoodItemPopupComponent,
        FoodItemDeletePopupComponent,
    ],
    entryComponents: [
        FoodItemComponent,
        FoodItemDialogComponent,
        FoodItemPopupComponent,
        FoodItemDeleteDialogComponent,
        FoodItemDeletePopupComponent,
    ],
    providers: [
        FoodItemService,
        FoodItemPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PantryAppFoodItemModule {}
