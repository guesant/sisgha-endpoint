import { DataSource, DataSourceOptions } from 'typeorm';
import { getPathEntities, getPathSeeds } from '../config/getPaths';
import { getSharedDataSourceOptions } from '../config/getSharedDataSourceOptions';

const getSeedDataSource = () => {
  const options = {
    ...getSharedDataSourceOptions(),

    entities: [`${getPathEntities()}/**/*{.ts,.js}`],
    migrations: [`${getPathSeeds()}/**/*{.ts,.js}`],

    migrationsTableName: 'app_migration_seed',
  };

  if (!options.type) {
    return null;
  }

  return new DataSource(options as DataSourceOptions);
};

const seedDataSource = getSeedDataSource();

export default seedDataSource;
