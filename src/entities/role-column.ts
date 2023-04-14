import { ColumnOptions } from 'typeorm';

export const RoleColumn = (options: ColumnOptions): ColumnOptions => ({
  ...options,
  type: 'enum',
  //   enumName: 'role_enum',
});
