import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { RetirementForm } from './retirement-form.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AdvanceForm } from './advance-form.entity';

@Entity()
export class SupportingDocs {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  fileName: string;

  @ApiProperty()
  @Column()
  mimeType: string;

  @ApiProperty()
  @Column()
  encoding: string;

  @ApiProperty()
  @Column()
  documentDescription: string;

  @ManyToOne('RetirementForm', 'supportingDocs', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  retirementForm: RetirementForm;

  @OneToOne('AdvanceForm', 'emailApproval', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  advanceForm: AdvanceForm;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @Column({ type: 'bytea', nullable: true })
  file: Uint8Array;
}
