import { BaseEntity, User } from './../../shared';

export class FoodItem implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public expiration?: any,
        public user?: User,
        public category?: BaseEntity,
    ) {
    }
}
