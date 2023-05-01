import type { Department } from './department.entity';
import type { AdvanceForm } from './advance-form.entity';
import type { Unit } from './unit.entity';
import type { RetirementForm } from './retirement-form.entity';
import type { Approvals } from './approval.entity';
import { RoleColumn } from './role-column';
import { Role } from '../types';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @BeforeInsert()
  hasPassword?() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @Column({ nullable: true })
  password: string | null;

  @ApiProperty()
  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  verified: Date;

  @ManyToOne('Department', 'members')
  department: Department | null;

  @ManyToOne('Unit', 'members')
  unit: Unit | null;

  @ManyToOne(() => User, (user) => user.directReports, {
    onDelete: 'SET NULL',
  })
  supervisor: User | null;

  @ApiProperty()
  @Column({ nullable: true })
  supervisorId: number | null;

  @ApiProperty()
  @Column({ nullable: true })
  unitId: number | null;

  @ApiProperty()
  @Column({ nullable: true })
  departmentId: number | null;

  @OneToMany(() => User, (employee) => employee.supervisor)
  directReports: User[];

  @ApiProperty()
  @Column(
    RoleColumn({
      enum: Role,
      default: Role.Staff,
    }),
  )
  role: Role;

  @OneToMany('AdvanceForm', 'user')
  advanceForms: AdvanceForm[];

  @OneToMany('RetirementForm', 'user')
  retirementForms: RetirementForm[];

  @Column({ nullable: true })
  passwordToken: string | null;

  @Column({ nullable: true })
  passwordTokenExpiration: Date | null;

  @OneToMany('Approvals', 'approvedBy')
  approvals: Approvals[];

  @Column({ default: false })
  delegated: boolean;

  @OneToOne('User', 'delegator', { onDelete: 'RESTRICT' })
  @JoinColumn()
  delegate: User | null;

  @Column({ nullable: true })
  delegateId: number | null;

  @OneToOne('User', 'delegate')
  delegator: User | null;
}

export class SerializedUser {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  @Exclude()
  password: string | null;

  isVerified: boolean;

  @Exclude()
  verificationToken: string | null;

  verified: Date | null;

  department: Department | null;

  unit: Unit | null;

  supervisor: User | null;

  supervisorId: number | null;

  unitId: number | null;

  departmentId: number | null;

  directReports: User[];

  role: number;

  approvals: Approvals[];

  advanceForms: AdvanceForm[];

  retirementForms: RetirementForm[];

  delegator: User | null;

  @Exclude()
  delegated: boolean;

  @Exclude()
  delegate: User | null;

  delegateId: number | null;

  @Exclude()
  passwordToken: string;

  @Exclude()
  passwordTokenExpiration: Date | null;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
