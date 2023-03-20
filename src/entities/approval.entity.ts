import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { AdvanceForm } from './advance-form.entity';
import { RetirementForm } from './retirement-form.entity';

enum ApprovalsFor {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}

@Entity()
export class Approvals {
  @PrimaryGeneratedColumn()
  id: '';

  @OneToOne(() => User)
  @JoinColumn()
  approvedBy: User;

  @CreateDateColumn()
  approvedOn: Date;

  @Column({
    type: 'enum',
    enum: ApprovalsFor,
  })
  type: string;

  @ManyToOne(() => AdvanceForm, (advanceForm) => advanceForm.approvals, {
    onDelete: 'CASCADE',
  })
  advanceApproved: AdvanceForm;

  @ManyToOne(
    () => RetirementForm,
    (retirementForm) => retirementForm.approvals,
    {
      onDelete: 'CASCADE',
    },
  )
  retirementApproved: RetirementForm;

  @Column()
  level: number;

  @Column()
  remark: string;
}
