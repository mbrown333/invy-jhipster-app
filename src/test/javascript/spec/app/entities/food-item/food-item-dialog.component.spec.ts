/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { PantryAppTestModule } from '../../../test.module';
import { FoodItemDialogComponent } from '../../../../../../main/webapp/app/entities/food-item/food-item-dialog.component';
import { FoodItemService } from '../../../../../../main/webapp/app/entities/food-item/food-item.service';
import { FoodItem } from '../../../../../../main/webapp/app/entities/food-item/food-item.model';
import { UserService } from '../../../../../../main/webapp/app/shared';
import { CategoryService } from '../../../../../../main/webapp/app/entities/category';

describe('Component Tests', () => {

    describe('FoodItem Management Dialog Component', () => {
        let comp: FoodItemDialogComponent;
        let fixture: ComponentFixture<FoodItemDialogComponent>;
        let service: FoodItemService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PantryAppTestModule],
                declarations: [FoodItemDialogComponent],
                providers: [
                    UserService,
                    CategoryService,
                    FoodItemService
                ]
            })
            .overrideTemplate(FoodItemDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FoodItemDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FoodItemService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new FoodItem(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.foodItem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'foodItemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new FoodItem();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.foodItem = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'foodItemListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
