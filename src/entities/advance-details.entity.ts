import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdvanceForm } from './';
import { Products } from '../types';
@Entity()
export class AdvanceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  advanceFormId: number;

  @ManyToOne(() => AdvanceForm, (advanceForm) => advanceForm.details, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  advanceForm: AdvanceForm;

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
