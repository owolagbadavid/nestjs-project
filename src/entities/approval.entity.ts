import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import type { AdvanceForm } from './advance-form.entity';
import type { RetirementForm } from './retirement-form.entity';
import { RoleColumn } from './role-column';
import { Role } from '../types';

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

  @ManyToOne('AdvanceForm', 'approval', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  advanceApproved: AdvanceForm;

  @ManyToOne('RetirementForm', 'approvals', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  retirementApproved: RetirementForm;

  @Column(RoleColumn({ enum: Role }))
  level: Role;

  @Column()
  remark: string;
}
