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
  password: string;

  @ApiProperty()
  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @ApiProperty()
  @Column({ nullable: true })
  verified: Date;

  @ManyToOne('Department', 'members')
  department: Department;

  @ManyToOne('Unit', 'members')
  unit: Unit;

  @ManyToOne(() => User, (user) => user.directReports, {
    onDelete: 'SET NULL',
  })
  supervisor: User;

  @ApiProperty()
  @Column({ nullable: true })
  supervisorId: number;

  @ApiProperty()
  @Column({ nullable: true })
  unitId: number;

  @ApiProperty()
  @Column({ nullable: true })
  departmentId: number;

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
  passwordToken: string;

  @Column({ nullable: true })
  passwordTokenExpiration: Date;

  @OneToMany('Approvals', 'approvedBy')
  approvals: Approvals[];

  @Column({ default: false })
  delegated: boolean;

  @OneToOne('User', 'delegator', { onDelete: 'RESTRICT' })
  @JoinColumn()
  delegate: User;

  @Column({ nullable: true })
  delegateId: number;

  @OneToOne('User', 'delegate')
  delegator: User;
}

export class SerializedUser {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  @Exclude()
  password: string;

  isVerified: boolean;

  @Exclude()
  verificationToken: string;

  verified: Date;

  department: Department;

  unit: Unit;

  supervisor: User;

  supervisorId: number;

  unitId: number;

  departmentId: number;

  directReports: User[];

  role: number;

  approvals: Approvals[];

  advanceForms: AdvanceForm[];

  retirementForms: RetirementForm[];

  delegator: User;

  @Exclude()
  delegated: boolean;

  @Exclude()
  delegate: User;

  delegateId: number;

  @Exclude()
  passwordToken: string;

  @Exclude()
  passwordTokenExpiration: Date;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
