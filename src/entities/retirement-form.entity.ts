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
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './';

export enum RetirementType {
  CASH = 'cash',
  ADVANCE = 'advance',
}

@Entity()
export class RetirementForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.retirementForms)
  user: User;

  @ApiProperty()
  @Column({ nullable: true })
  userId: number;

  @ApiProperty()
  @Column()
  purpose: string;

  @ApiProperty()
  @Column()
  depatureDate: Date;

  @ApiProperty()
  @Column()
  returnDate: Date;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: RetirementType,
  })
  type: string;

  @OneToOne(() => AdvanceForm, (advanceForm) => advanceForm.retirement)
  advance: AdvanceForm;

  @ApiProperty()
  @Column({ nullable: true })
  preApprovalRemarkByFinance: string;

  @ApiProperty()
  @Column({ nullable: true })
  financeGoAhead: boolean;

  @ApiProperty()
  @Column()
  approvalLevel: number;

  @ApiProperty()
  @Column({ nullable: true })
  nextApprovalLevel: Role;

  @ApiProperty()
  @Column({ default: false })
  delegatedByPD: boolean;

  @ApiProperty()
  @Column({ default: false })
  pushedToFinance: boolean;

  @ApiProperty()
  @Column({ default: false })
  approvedByFin: boolean;

  @ApiProperty()
  @Column({ default: false })
  rejected: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  rejectionReason: string;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  remarkByFin: string;

  @ApiProperty({ isArray: true, type: () => ExpenseDetails })
  @OneToMany(
    () => ExpenseDetails,
    (expenseDetails) => expenseDetails.retirementForm,
    { cascade: true },
  )
  details: ExpenseDetails[];

  @ApiProperty()
  @Column()
  totalAmount: number;

  @ApiProperty({ isArray: true, type: () => SupportingDocs })
  @OneToMany(
    () => SupportingDocs,
    (supportingDocs) => supportingDocs.retirementForm,
    { cascade: true },
  )
  supportingDocs: SupportingDocs[];

  @OneToMany(() => Approvals, (approvals) => approvals.retirementApproved)
  approvals: Approvals[];

  @ApiProperty()
  @Column()
  balanceToStaff: number;

  @ApiProperty()
  @Column()
  balanceToOrganization: number;

  @Column({ nullable: true })
  supervisorToken: string;
}

export class SerializedRetirementForm {
  id: number;

  user: User;

  userId: number;

  purpose: string;

  depatureDate: Date;

  returnDate: Date;

  type: string;

  advance: AdvanceForm;

  preApprovalRemarkByFinance: string;

  financeGoAhead: boolean;

  approvalLevel: number;

  nextApprovalLevel: Role;

  delegatedByPD: boolean;

  pushedToFinance: boolean;

  approvedByFin: boolean;

  rejected: boolean;

  rejectionReason: string;

  updatedAt: Date;

  remarkByFin: string;

  details: ExpenseDetails[];

  totalAmount: number;

  supportingDocs: SupportingDocs[];

  approvals: Approvals[];

  balanceToStaff: number;

  balanceToOrganization: number;

  @Exclude()
  supervisorToken: string;

  constructor(partial: Partial<SerializedRetirementForm>) {
    Object.assign(this, partial);
  }
}
