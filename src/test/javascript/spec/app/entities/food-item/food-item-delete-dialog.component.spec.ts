/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { PantryAppTestModule } from '../../../test.module';
import { FoodItemDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/food-item/food-item-delete-dialog.component';
import { FoodItemService } from '../../../../../../main/webapp/app/entities/food-item/food-item.service';

describe('Component Tests', () => {

    describe('FoodItem Management Delete Component', () => {
        let comp: FoodItemDeleteDialogComponent;
        let fixture: ComponentFixture<FoodItemDeleteDialogComponent>;
        let service: FoodItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PantryAppTestModule],
                declarations: [FoodItemDeleteDialogComponent],
                providers: [
                    FoodItemService
                ]
            })
            .overrideTemplate(FoodItemDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FoodItemDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FoodItemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
