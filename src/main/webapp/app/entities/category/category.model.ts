import { BaseEntity, User } from './../../shared';

export class Category implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public user?: User,
    ) {
    }
}
