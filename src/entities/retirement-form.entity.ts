import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { SupportingDocs } from './supporting-docs.entity';
import type { User } from './user.entity';
import type { AdvanceForm } from './advance-form.entity';
import type { ExpenseDetails } from './expense-details.entity';
import type { Approvals } from './approval.entity';
import { Role, CurrencyScope } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { RoleColumn } from './role-column';

export enum RetirementType {
  CASH = 'cash',
  ADVANCE = 'advance',
}

@Entity('retirement_forms')
export class RetirementForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'retirementForms')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @ApiProperty()
  @Column()
  purpose: string;

  @ApiProperty()
  @Column({ name: 'departure_date' })
  departureDate: Date;

  @ApiProperty()
  @Column({ name: 'return_date' })
  returnDate: Date;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: RetirementType,
  })
  type: string;

  @OneToOne('AdvanceForm', 'retirement')
  advance: AdvanceForm;

  @ApiProperty()
  @Column({ nullable: true, name: 'pre_approval_remark_by_fin' })
  preApprovalRemarkByFinance: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'finance_go_ahead' })
  financeGoAhead: boolean;

  @ApiProperty()
  @Column(RoleColumn({ enum: Role, name: 'approval_level' }))
  approvalLevel: Role;

  @ApiProperty()
  @Column(
    RoleColumn({ enum: Role, nullable: true, name: 'next_approval_level' }),
  )
  nextApprovalLevel: Role;

  @ApiProperty()
  @Column({ default: false, name: 'pushed_to_finance' })
  pushedToFinance: boolean;

  @ApiProperty()
  @Column({ default: false, name: 'approved_by_fin' })
  approvedByFin: boolean;

  @ApiProperty()
  @Column({ default: false })
  rejected: boolean;

  @ApiProperty()
  @Column({ nullable: true, name: 'rejection_reason' })
  rejectionReason: string;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @Column({ nullable: true, name: 'remark_by_fin' })
  remarkByFin: string;

  @ApiProperty({ isArray: true, type: 'ExpenseDetails' })
  @OneToMany('ExpenseDetails', 'retirementForm', { cascade: true })
  details: ExpenseDetails[];

  @ApiProperty()
  @Column({ name: 'total_amount', type: 'numeric' })
  totalAmount: number;

  @ApiProperty({ isArray: true, type: 'SupportingDocs' })
  @OneToMany('SupportingDocs', 'retirementForm', { cascade: true })
  supportingDocs: SupportingDocs[];

  @OneToMany('Approvals', 'retirementApproved')
  approvals: Approvals[];

  @ApiProperty()
  @Column({ name: 'balance_to_staff', type: 'numeric' })
  balanceToStaff: number;

  @ApiProperty()
  @Column({ name: 'balance_to_organization', type: 'numeric' })
  balanceToOrganization: number;

  @Column({ default: false })
  disbursed: boolean;

  @Column({
    type: 'enum',
    enum: CurrencyScope,
    default: CurrencyScope.local,
    name: 'currency_scope',
  })
  currencyScope: CurrencyScope;
}

export class SerializedRetirementForm {
  id: number;

  user: User;

  userId: number;

  purpose: string;

  departureDate: Date;

  returnDate: Date;

  type: string;

  advance: AdvanceForm;

  preApprovalRemarkByFinance: string;

  financeGoAhead: boolean;

  approvalLevel: number;

  nextApprovalLevel: Role;

  pushedToFinance: boolean;

  approvedByFin: boolean;

  rejected: boolean;

  rejectionReason: string;

  updatedAt: Date;

  createdAt: Date;

  remarkByFin: string;

  details: ExpenseDetails[];

  totalAmount: number;

  supportingDocs: SupportingDocs[];

  approvals: Approvals[];

  balanceToStaff: number;

  balanceToOrganization: number;

  disbursed: boolean;

  currencyScope: CurrencyScope;

  constructor(partial: Partial<SerializedRetirementForm>) {
    Object.assign(this, partial);
  }
}
