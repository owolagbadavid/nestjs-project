import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RetirementForm } from './retirement-form.entity';
import { ProductColumn } from './product-column';
import { Products } from '../types';
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

  @Column(ProductColumn({ enum: Products }))
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
