import {Entity, model, property} from '@loopback/repository';
import {Roles} from '../enums/roles';

@model({
  settings: {postgresql: {schema: 'dbschema', table: 'role'}},
})
export class Role extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // key: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Roles),
    },
  })
  key: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  roleid?: number;


  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
