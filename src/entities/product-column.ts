import { ColumnOptions } from 'typeorm';

export const ProductColumn = (options: ColumnOptions): ColumnOptions => ({
  ...options,
  type: 'enum',
  // enumName: 'product_enum',
});
