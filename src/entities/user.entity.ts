import {
  Role,
  Department,
  AdvanceForm,
  Unit,
  RetirementForm,
  Approvals,
} from './';

import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity()
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

  @ManyToOne(() => Department, (department) => department.members)
  department: Department;

  @ManyToOne(() => Unit, (unit) => unit.members)
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
  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'Role',
    default: 0 /*Role.Staff*/,
  })
  role: number;

  @OneToMany(() => AdvanceForm, (advanceForm) => advanceForm.user)
  advanceForms: AdvanceForm[];

  @OneToMany(() => RetirementForm, (retirementForm) => retirementForm.user)
  retirementForms: RetirementForm[];

  @Column({ nullable: true })
  passwordToken: string;

  @Column({ nullable: true })
  passwordTokenExpiration: Date;

  @OneToMany(() => Approvals, (approval) => approval.approvedBy)
  approvals: Approvals[];
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

  @Exclude()
  passwordToken: string;

  @Exclude()
  passwordTokenExpiration: Date;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
