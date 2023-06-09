import type { Department } from './department.entity';
import type { AdvanceForm } from './advance-form.entity';
import type { Unit } from './unit.entity';
import type { RetirementForm } from './retirement-form.entity';
import type { Approvals } from './approval.entity';
import { RoleColumn } from './role-column';
import { Role } from '../types';
import type { ProfilePicture } from './profile-pictures.entity';
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
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @ApiProperty()
  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({ nullable: true })
  password: string | null;

  @ApiProperty()
  @Column({ default: false, type: 'boolean' })
  isVerified: boolean;

  @Column({ nullable: true, name: 'verification_token' })
  verificationToken: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  verified: Date;

  @ManyToOne('Department', 'members')
  @JoinColumn({ name: 'department_id' })
  department: Department | null;

  @ManyToOne('Unit', 'members')
  @JoinColumn({ name: 'unit_id' })
  unit: Unit | null;

  @ManyToOne(() => User, (user) => user.directReports, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor: User | null;

  @ApiProperty()
  @Column({ nullable: true, name: 'supervisor_id' })
  supervisorId: number | null;

  @ApiProperty()
  @Column({ nullable: true, name: 'unit_id' })
  unitId: number | null;

  @ApiProperty()
  @Column({ nullable: true, name: 'department_id' })
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

  @Column({ nullable: true, name: 'password_token' })
  passwordToken: string | null;

  @Column({ nullable: true, name: 'password_token_expiration' })
  passwordTokenExpiration: Date | null;

  @OneToMany('Approvals', 'approvedBy')
  approvals: Approvals[];

  @Column({ default: false })
  delegated: boolean;

  @OneToOne('User', 'delegator', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'delegate_id' })
  delegate: User | null;

  @Column({ nullable: true, name: 'delegate_id' })
  delegateId: number | null;

  @OneToOne('User', 'delegate')
  delegator: User | null;

  @OneToOne('ProfilePicture', 'user', { cascade: true })
  profilePicture: ProfilePicture | null;
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

  @Exclude()
  profilePicture: ProfilePicture | null;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
