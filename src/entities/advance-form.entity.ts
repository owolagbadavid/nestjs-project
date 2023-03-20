import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  nextApprovalLevel: number;

  @Column({ type: 'bool', default: false })
  delegatedByPD: boolean;

  @Column({ type: 'bool', default: false })
  pushedToFinance: boolean;

  @Column({ default: false })
  approvedByFin: boolean;

  @Column({ default: false })
  rejected: boolean;

  @Column()
  remarkByFin: string;

  @OneToMany(
    () => AdvanceDetails,
    (advanceDetails) => advanceDetails.advanceForm,
  )
  details: AdvanceDetails[];

  @OneToMany(() => Approvals, (approvals) => approvals.advanceApproved)
  approvals: Approvals[];

  @Column()
  totalAmount: number;

  @OneToOne(() => RetirementForm, (retirementForm) => retirementForm.advance)
  @JoinColumn()
  retirement: RetirementForm;
}
