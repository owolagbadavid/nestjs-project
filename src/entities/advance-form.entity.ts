import {
  BeforeInsert,
  BeforeUpdate,
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
  @BeforeInsert()
  @BeforeUpdate()
  setDefaults() {
    this.approvalLevel = 0;
    this.nextApprovalLevel = this.user.supervisor.role;
    this.approvals = [];
    this.preApprovalRemarkByFinance = null;
    this.delegatedByPD = false;
    this.pushedToFinance = false;
    this.approvedByFin = false;
    this.rejected = false;
    this.remarkByFin = null;
  }

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
