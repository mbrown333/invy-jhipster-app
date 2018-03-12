/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { PantryAppTestModule } from '../../../test.module';
import { FoodItemDetailComponent } from '../../../../../../main/webapp/app/entities/food-item/food-item-detail.component';
import { FoodItemService } from '../../../../../../main/webapp/app/entities/food-item/food-item.service';
import { FoodItem } from '../../../../../../main/webapp/app/entities/food-item/food-item.model';

describe('Component Tests', () => {

    describe('FoodItem Management Detail Component', () => {
        let comp: FoodItemDetailComponent;
        let fixture: ComponentFixture<FoodItemDetailComponent>;
        let service: FoodItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PantryAppTestModule],
                declarations: [FoodItemDetailComponent],
                providers: [
                    FoodItemService
                ]
            })
            .overrideTemplate(FoodItemDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FoodItemDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FoodItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new FoodItem(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.foodItem).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
