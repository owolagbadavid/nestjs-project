import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RetirementForm, Products } from './';

@Entity()
export class ExpenseDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  retirementFormId: number;

  @ManyToOne(() => RetirementForm, (retirementForm) => retirementForm.details, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  retirementForm: RetirementForm;

  @Column({
    type: 'enum',
    enum: Products,
    enumName: 'Product',
  })
  product: Products;

  @Column()
  rate: number;

  @Column()
  amount: number;

  @Column()
  number: number;

  @Column()
  remark: string;
}
