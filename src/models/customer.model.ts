import {Entity, hasOne, model, property} from '@loopback/repository';
import {User} from './user.model';

@model({
  settings: {postgresql: {schema: 'dbschema', table: 'customer'}},
})
export class Customer extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  website?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  customerid?: number;

  @hasOne(() => User)
  user?: User;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
