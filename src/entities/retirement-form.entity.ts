import {
  Column,
  Entity,
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
import { Exclude } from 'class-transformer';
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
  user: User;

  @ApiProperty()
  @Column({ nullable: true })
  userId: number;

  @ApiProperty()
  @Column()
  purpose: string;

  @ApiProperty()
  @Column()
  departureDate: Date;

  @ApiProperty()
  @Column()
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
  @Column({ nullable: true })
  preApprovalRemarkByFinance: string;

  @ApiProperty()
  @Column({ nullable: true })
  financeGoAhead: boolean;

  @ApiProperty()
  @Column(RoleColumn({ enum: Role }))
  approvalLevel: Role;

  @ApiProperty()
  @Column(RoleColumn({ enum: Role, nullable: true }))
  nextApprovalLevel: Role;

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

  @ApiProperty({ isArray: true, type: 'ExpenseDetails' })
  @OneToMany('ExpenseDetails', 'retirementForm', { cascade: true })
  details: ExpenseDetails[];

  @ApiProperty()
  @Column()
  totalAmount: number;

  @ApiProperty({ isArray: true, type: 'SupportingDocs' })
  @OneToMany('SupportingDocs', 'retirementForm', { cascade: true })
  supportingDocs: SupportingDocs[];

  @OneToMany('Approvals', 'retirementApproved')
  approvals: Approvals[];

  @ApiProperty()
  @Column()
  balanceToStaff: number;

  @ApiProperty()
  @Column()
  balanceToOrganization: number;

  @Column({ default: false })
  disbursed: boolean;

  @Column({ nullable: true })
  supervisorToken: string;

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

  remarkByFin: string;

  details: ExpenseDetails[];

  totalAmount: number;

  supportingDocs: SupportingDocs[];

  approvals: Approvals[];

  balanceToStaff: number;

  balanceToOrganization: number;

  disbursed: boolean;

  currencyScope: CurrencyScope;

  @Exclude()
  supervisorToken: string;

  constructor(partial: Partial<SerializedRetirementForm>) {
    Object.assign(this, partial);
  }
}
