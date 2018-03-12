import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PantryAppSharedModule } from '../shared';

import { EXPIRATION_ROUTE, ExpirationComponent } from './';

@NgModule({
    imports: [
        PantryAppSharedModule,
        RouterModule.forChild([ EXPIRATION_ROUTE ])
    ],
    declarations: [
        ExpirationComponent,
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PantryAppExpirationModule {}
