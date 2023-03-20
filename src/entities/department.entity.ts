import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Unit } from './unit.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Department {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  headId: number;

  @OneToOne(() => User)
  @JoinColumn()
  head: User;

  @OneToMany(() => Unit, (unit) => unit.department)
  units: Unit[];

  @OneToMany(() => User, (user) => user.department)
  members: User[];
}
