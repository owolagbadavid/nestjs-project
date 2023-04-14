import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { AdvanceForm } from './advance-form.entity';
import { ProductColumn } from './product-column';
import { Products } from '../types';
@Entity()
export class AdvanceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  advanceFormId: number;

  @ManyToOne('AdvanceForm', 'details', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  advanceForm: AdvanceForm;

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
