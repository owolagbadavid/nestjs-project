import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { AdvanceForm } from './advance-form.entity';

@Entity()
export class AdvanceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('AdvanceForm', 'details', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'advance_form_id' })
  advanceForm: AdvanceForm;

  @Column()
  product: string;

  @Column({ type: 'numeric' })
  rate: number;

  @Column({ type: 'numeric' })
  amount: number;

  @Column({ type: 'numeric' })
  number: number;

  @Column({ nullable: true })
  remark: string;
}
