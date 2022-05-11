// import {inject} from '@loopback/core';
// import {DefaultCrudRepository} from '@loopback/repository';
// import {PostgresdbDataSource} from '../datasources';
// import {User, UserRelations} from '../models';

// export class UserRepository extends DefaultCrudRepository<
//   User,
//   typeof User.prototype.userid,
//   UserRelations
// > {
//   constructor(
//     @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
//   ) {
//     super(User, dataSource);
//   }
// }

import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {PostgresdbDataSource} from '../datasources';
import {Customer, Role, User, UserRelations} from '../models';
import {CustomerRepository} from './customer.repository';
import {RoleRepository} from './role.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userid,
  UserRelations
> {

  public readonly customer: BelongsToAccessor<Customer, typeof User.prototype.userid>;
  public readonly role: HasOneRepositoryFactory<Role, typeof User.prototype.userid>;

  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('CustomerRepository')
    getCustomerRepository: Getter<CustomerRepository>,
    @repository.getter('RoleRepository')
    getRoleRepository: Getter<RoleRepository>,
  ) {
    super(User, dataSource);

    this.role = this.createHasOneRepositoryFactoryFor(
      'role',
      getRoleRepository,
    );
    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.customer = this.createBelongsToAccessorFor(
      'customer',
      getCustomerRepository
    );
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);

  }
}
