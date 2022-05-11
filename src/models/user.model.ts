import {belongsTo, Entity, hasOne, model, property} from '@loopback/repository';
import {Roles} from '../enums/roles';
import {Customer, CustomerRelations} from './customer.model';
import {Role} from './role.model';

@model({
  settings: {postgresql: {schema: 'dbschema', table: 'user'}},
})

// @model()
export class User extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
  })
  middlename?: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  // @property({
  //   type: 'number',
  //   required: true,
  // })
  // roleid: number;
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Roles),
    },
  })
  roleid: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  userid?: number;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdOn?: string;

  @property({
    type: 'date',
  })
  modifiedOn?: string;

  @hasOne(() => Role, {keyTo: 'key', keyFrom: 'roleid'})
  role?: Role;

  @belongsTo(() => Customer, {keyTo: 'customerid', name: 'customer'})
  customerid?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  customer?: CustomerRelations
}

export type UserWithRelations = User & UserRelations;
