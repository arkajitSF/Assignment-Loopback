import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  name: 'postgresdb',
  connector: process.env.DB_CONNECTOR,
  url: '',
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PostgresdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'postgresdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.postgresdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
