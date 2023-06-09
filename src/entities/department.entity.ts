import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Unit } from './unit.entity';
import type { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('departments')
export class Department {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true, name: 'head_id' })
  headId: number;

  @OneToOne('User', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'head_id' })
  head: User;

  @OneToMany('Unit', 'department')
  units: Unit[];

  @OneToMany('User', 'department')
  members: User[];
}
