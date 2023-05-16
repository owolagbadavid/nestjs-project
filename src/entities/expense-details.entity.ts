import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { RetirementForm } from './retirement-form.entity';

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
