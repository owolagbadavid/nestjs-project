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
import type { RetirementForm } from './retirement-form.entity';
import type { Approvals } from './approval.entity';
import type { AdvanceDetails } from './advance-details.entity';
import type { User } from './user.entity';
import { RoleColumn } from './role-column';
import { ApiProperty } from '@nestjs/swagger';
import { CurrencyScope, Role } from '../types';
import { SupportingDocs } from './supporting-docs.entity';

@Entity('advance_forms')
export class AdvanceForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'advanceForms')
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
  @Column()
  origination: string;

  @ApiProperty()
  @Column()
  destination: string;

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
  @Column({ type: 'bool', default: false, name: 'pushed_to_finance' })
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

  @ApiProperty({ isArray: true, type: 'AdvanceDetails' })
  @OneToMany('AdvanceDetails', 'advanceForm', { cascade: true })
  details: AdvanceDetails[];

  @OneToMany('Approvals', 'advanceApproved')
  approvals: Approvals[];

  @ApiProperty()
  @Column({ nullable: true, name: 'retirement_id' })
  retirementId: number;

  @ApiProperty()
  @Column({ type: 'numeric', name: 'total_amount' })
  totalAmount: number;

  @ApiProperty()
  @OneToOne('SupportingDocs', 'advanceForm', {
    cascade: true,
  })
  emailApproval: SupportingDocs;

  @OneToOne('RetirementForm', 'advance', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'retirement_id' })
  retirement: RetirementForm;

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

export class SerializedAdvanceForm {
  id: number;

  user: User;

  userId: number;

  purpose: string;

  departureDate: Date;

  returnDate: Date;

  origination: string;

  destination: string;

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

  details: AdvanceDetails[];

  approvals: Approvals[];

  retirementId: number;

  totalAmount: number;

  emailApproval: SupportingDocs;

  retirement: RetirementForm;

  disbursed: boolean;

  currencyScope: CurrencyScope;

  constructor(partial: Partial<SerializedAdvanceForm>) {
    Object.assign(this, partial);
  }
}
