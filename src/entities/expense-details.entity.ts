import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RetirementForm } from './retirement-form.entity';

@Entity()
export class ExpenseDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RetirementForm, (retirementForm) => retirementForm.details, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'retirement_form_id' })
  retirementForm: RetirementForm;

  @Column()
  product: string;

  @Column()
  rate: number;

  @Column()
  amount: number;

  @Column()
  number: number;

  @Column({ nullable: true })
  remark: string;
}
