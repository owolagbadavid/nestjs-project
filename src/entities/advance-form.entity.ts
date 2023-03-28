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

@Entity()
export class AdvanceForm {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.advanceForms)
  user: User;

  @Column({ nullable: true })
  userId: number;

  @Column()
  purpose: string;

  @Column()
  depatureDate: Date;

  @Column()
  returnDate: Date;

  @Column()
  origination: string;

  @Column()
  destination: string;

  @Column({ nullable: true })
  preApprovalRemarkByFinance: string;

  @Column()
  approvalLevel: number;

  @Column({ nullable: true })
  nextApprovalLevel: number;

  @Column({ type: 'bool', default: false })
  delegatedByPD: boolean;

  @Column({ type: 'bool', default: false })
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
    () => AdvanceDetails,
    (advanceDetails) => advanceDetails.advanceForm,
    { cascade: true },
  )
  details: AdvanceDetails[];

  @OneToMany(() => Approvals, (approvals) => approvals.advanceApproved)
  approvals: Approvals[];

  @Column({ nullable: true })
  retirementId: number;

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
