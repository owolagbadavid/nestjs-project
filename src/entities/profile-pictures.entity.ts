import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { User } from './user.entity';

@Entity()
export class ProfilePicture {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'file_name' })
  fileName: string;

  @ApiProperty()
  @Column({ name: 'mime_type' })
  mimeType: string;

  @ApiProperty()
  @Column()
  encoding: string;

  @OneToOne('User', 'profilePicture', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @Column({ type: 'bytea', nullable: true })
  file: Uint8Array;
}
