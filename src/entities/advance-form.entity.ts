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

import { User } from './user.entity';
import { AdvanceDetails } from './advance-details.entity';
import { RetirementForm } from './retirement-form.entity';
import { Approvals } from './approval.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class AdvanceForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.advanceForms)
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
  @Column()
  approvalLevel: number;

  @ApiProperty()
  @Column({ nullable: true })
  nextApprovalLevel: number;

  @ApiProperty()
  @Column({ type: 'bool', default: false })
  delegatedByPD: boolean;

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

  @ApiProperty({ isArray: true, type: () => AdvanceDetails })
  @OneToMany(
    () => AdvanceDetails,
    (advanceDetails) => advanceDetails.advanceForm,
    { cascade: true },
  )
  details: AdvanceDetails[];

  @OneToMany(() => Approvals, (approvals) => approvals.advanceApproved)
  approvals: Approvals[];

  @ApiProperty()
  @Column({ nullable: true })
  retirementId: number;

  @ApiProperty()
  @Column()
  totalAmount: number;

  @OneToOne(() => RetirementForm, (retirementForm) => retirementForm.advance, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  retirement: RetirementForm;

  @Column({ nullable: true })
  supervisorToken: string;
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

  approvalLevel: number;

  nextApprovalLevel: number;

  delegatedByPD: boolean;

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

  retirement: RetirementForm;

  @Exclude()
  supervisorToken: string;

  constructor(partial: Partial<SerializedAdvanceForm>) {
    Object.assign(this, partial);
  }
}
