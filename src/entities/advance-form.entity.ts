import {
  Column,
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
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../types';
import { SupportingDocs } from './supporting-docs.entity';

@Entity('advance_forms')
export class AdvanceForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'advanceForms')
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
  @Column()
  origination: string;

  @ApiProperty()
  @Column()
  destination: string;

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
  @Column({ type: 'bool', default: false })
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

  @ApiProperty({ isArray: true, type: 'AdvanceDetails' })
  @OneToMany('AdvanceDetails', 'advanceForm', { cascade: true })
  details: AdvanceDetails[];

  @OneToMany('Approvals', 'advanceApproved')
  approvals: Approvals[];

  @ApiProperty()
  @Column({ nullable: true })
  retirementId: number;

  @ApiProperty()
  @Column()
  totalAmount: number;

  @ApiProperty()
  @OneToOne('SupportingDocs', 'advanceForm', {
    cascade: true,
  })
  emailApproval: SupportingDocs;

  @OneToOne('RetirementForm', 'advance', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  retirement: RetirementForm;

  @Column({ nullable: true })
  supervisorToken: string;

  @Column({ default: false })
  disbursed: boolean;
}

export class SerializedAdvanceForm {
  id: number;

  user: User;

  userId: number;

  purpose: string;

  depatureDate: Date;

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

  remarkByFin: string;

  details: AdvanceDetails[];

  approvals: Approvals[];

  retirementId: number;

  totalAmount: number;

  emailApproval: SupportingDocs;

  retirement: RetirementForm;

  disbursed: boolean;

  @Exclude()
  supervisorToken: string;

  constructor(partial: Partial<SerializedAdvanceForm>) {
    Object.assign(this, partial);
  }
}
