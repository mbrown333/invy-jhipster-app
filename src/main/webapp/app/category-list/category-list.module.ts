import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PantryAppSharedModule } from '../shared';

import { CATEGORY_LIST_ROUTE, CategoryListComponent } from './';

@NgModule({
    imports: [
        PantryAppSharedModule,
        RouterModule.forChild([ CATEGORY_LIST_ROUTE ])
    ],
    declarations: [
        CategoryListComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PantryAppCategoryListModule {}
