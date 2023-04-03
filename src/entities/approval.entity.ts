import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, AdvanceForm, RetirementForm } from './';

export enum ApprovalsFor {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}

@Entity()
export class Approvals {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.approvals)
  approvedBy: User;

  @CreateDateColumn()
  approvedOn: Date;

  @Column({
    type: 'enum',
    enum: ApprovalsFor,
  })
  type: string;

  @ManyToOne(() => AdvanceForm, (advanceForm) => advanceForm.approvals, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  advanceApproved: AdvanceForm;

  @ManyToOne(
    () => RetirementForm,
    (retirementForm) => retirementForm.approvals,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  retirementApproved: RetirementForm;

  @Column()
  level: number;

  @Column()
  remark: string;
}
