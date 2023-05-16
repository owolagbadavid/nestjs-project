import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { AdvanceForm } from './advance-form.entity';

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

  @Column()
  product: string;

  @Column()
  rate: number;

  @Column()
  amount: number;

  @Column()
  number: number;

  @Column()
  remark: string;
}
