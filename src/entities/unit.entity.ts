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
  @Column({ nullable: true, name: 'head_id' })
  headId: number;

  @ApiProperty()
  @Column({ nullable: true, name: 'department_id' })
  departmentId: number;

  @ManyToOne(() => Department, (department) => department.units, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToOne('User', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'head_id' })
  head: User;

  @OneToMany('User', 'unit')
  members: User[];
}
