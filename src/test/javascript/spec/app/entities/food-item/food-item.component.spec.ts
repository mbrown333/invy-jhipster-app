/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { PantryAppTestModule } from '../../../test.module';
import { FoodItemComponent } from '../../../../../../main/webapp/app/entities/food-item/food-item.component';
import { FoodItemService } from '../../../../../../main/webapp/app/entities/food-item/food-item.service';
import { FoodItem } from '../../../../../../main/webapp/app/entities/food-item/food-item.model';

describe('Component Tests', () => {

    describe('FoodItem Management Component', () => {
        let comp: FoodItemComponent;
        let fixture: ComponentFixture<FoodItemComponent>;
        let service: FoodItemService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [PantryAppTestModule],
                declarations: [FoodItemComponent],
                providers: [
                    FoodItemService
                ]
            })
            .overrideTemplate(FoodItemComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(FoodItemComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(FoodItemService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new FoodItem(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.foodItems[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
