import { Role } from 'src/entities/roles.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { AdvanceForm } from './advance-form.entity';
import { Unit } from './unit.entity';
import { RetirementForm } from './retirement-form.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Approvals } from './approval.entity';

@Entity()
export class User {
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
    default: Role.Staff,
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
