import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { AdvanceForm } from './advance-form.entity';
import { ExpenseDetails } from './expense-details.entity';
import { Approvals } from './approval.entity';
import { SupportingDocs } from './supporting-docs.entity';

export enum RetirementType {
  CASH = 'cash',
  ADVANCE = 'advance',
}

@Entity()
export class RetirementForm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.retirementForms)
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column()
  purpose: string;

  @Column()
  depatureDate: Date;

  @Column()
  returnDate: Date;

  @Column({
    type: 'enum',
    enum: RetirementType,
  })
  type: string;

  @OneToOne(() => AdvanceForm, (advanceForm) => advanceForm.retirement)
  advance: AdvanceForm;

  @Column({ nullable: true })
  preApprovalRemarkByFinance: string;

  @Column()
  approvalLevel: number;

  @Column({ nullable: true })
  nextApprovalLevel: number;

  @Column({ default: false })
  delegatedByPD: boolean;

  @Column({ default: false })
  pushedToFinance: boolean;

  @Column({ default: false })
  approvedByFin: boolean;

  @Column({ default: false })
  rejected: boolean;

  @Column({ nullable: true })
  rejectionReason: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  remarkByFin: string;

  @OneToMany(
    () => ExpenseDetails,
    (expenseDetails) => expenseDetails.retirementForm,
    { cascade: true },
  )
  details: ExpenseDetails[];

  @OneToMany(
    () => SupportingDocs,
    (supportingDocs) => supportingDocs.retirementForm,
    { cascade: true },
  )
  supportingDocs: SupportingDocs[];

  @OneToMany(() => Approvals, (approvals) => approvals.retirementApproved)
  approvals: Approvals[];

  @Column()
  balanceToStaff: number;

  @Column()
  balanceToOrganization: number;

  @Column({ nullable: true })
  supervisorToken: string;
}
