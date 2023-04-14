import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from './user.entity';
import { Department } from './department.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('units')
export class Unit {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  headId: number;

  @ApiProperty()
  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.units)
  department: Department;

  @OneToOne('User')
  @JoinColumn()
  head: User;

  @OneToMany('User', 'unit')
  members: User[];
}
