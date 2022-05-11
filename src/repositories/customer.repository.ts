import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresdbDataSource} from '../datasources';
import {Customer, CustomerRelations} from '../models';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.customerid,
  CustomerRelations
> {
  constructor(
    @inject('datasources.postgresdb') dataSource: PostgresdbDataSource,
  ) {
    super(Customer, dataSource);
  }
}

// import {Getter, inject} from '@loopback/core';
// import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
// import {PostgresdbDataSource} from '../datasources';
// import {Customer, CustomerRelations, User} from '../models';
// import {UserRepository} from './user.repository';

// export class CustomerRepository extends DefaultCrudRepository<
//   Customer,
//   typeof Customer.prototype.customerid,
//   CustomerRelations
// > {

//   public readonly user: HasOneRepositoryFactory<User, typeof Customer.prototype.customerid>;

//   constructor(
//     @inject('datasources.postgresdb') dataSource: PostgresdbDataSource, @repository.getter('UserRepository')
//     getUserRepository: Getter<UserRepository>,
//   ) {
//     super(Customer, dataSource);
//     this.user = this.createHasOneRepositoryFactoryFor(
//       'account',
//       getUserRepository,
//     );
//     this.registerInclusionResolver('user', this.user.inclusionResolver);

//   }
// }
