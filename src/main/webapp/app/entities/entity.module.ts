import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PantryAppCategoryModule } from './category/category.module';
import { PantryAppFoodItemModule } from './food-item/food-item.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        PantryAppCategoryModule,
        PantryAppFoodItemModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PantryAppEntityModule {}
