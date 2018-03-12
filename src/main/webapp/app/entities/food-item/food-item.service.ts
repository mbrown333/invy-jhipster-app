import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { FoodItem } from './food-item.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<FoodItem>;

@Injectable()
export class FoodItemService {

    private resourceUrl =  SERVER_API_URL + 'api/food-items';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(foodItem: FoodItem): Observable<EntityResponseType> {
        const copy = this.convert(foodItem);
        return this.http.post<FoodItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(foodItem: FoodItem): Observable<EntityResponseType> {
        const copy = this.convert(foodItem);
        return this.http.put<FoodItem>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<FoodItem>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<FoodItem[]>> {
        const options = createRequestOption(req);
        return this.http.get<FoodItem[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<FoodItem[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: FoodItem = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<FoodItem[]>): HttpResponse<FoodItem[]> {
        const jsonResponse: FoodItem[] = res.body;
        const body: FoodItem[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to FoodItem.
     */
    private convertItemFromServer(foodItem: FoodItem): FoodItem {
        const copy: FoodItem = Object.assign({}, foodItem);
        copy.created = this.dateUtils
            .convertDateTimeFromServer(foodItem.created);
        copy.expiration = this.dateUtils
            .convertDateTimeFromServer(foodItem.expiration);
        return copy;
    }

    /**
     * Convert a FoodItem to a JSON which can be sent to the server.
     */
    private convert(foodItem: FoodItem): FoodItem {
        const copy: FoodItem = Object.assign({}, foodItem);
        copy.created = this.dateUtils.toDate(foodItem.created);

        if (foodItem.expiration) {
            const expiration = foodItem.expiration.split('-');
            if (expiration.length === 3) {
                copy.expiration = new Date(expiration[0], expiration[1] - 1, expiration[2]);
            }
        }

        return copy;
    }
}
