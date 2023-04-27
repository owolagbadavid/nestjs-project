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
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DATABASE,
  username: 'postgres',
  // password: '12345678',
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
  synchronize: process.env.NODE_ENV === 'test',
  migrations:
    process.env.NODE_ENV === 'test' ? null : ['dist/db/migrations/*.js'],

  //   synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
