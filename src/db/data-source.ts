import {
  AdvanceDetails,
  AdvanceForm,
  Approvals,
  Department,
  ExpenseDetails,
  RetirementForm,
  SupportingDocs,
  Unit,
  User,
} from '../entities';

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  // username: 'user1',
  // password: '12345678',
  database: 'cashAdvNRtr',
  entities: [
    User,
    Department,
    Unit,
    AdvanceForm,
    AdvanceDetails,
    RetirementForm,
    ExpenseDetails,
    Approvals,
    SupportingDocs,
  ],
  migrations: ['dist/db/migrations/*.js'],

  //   synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
