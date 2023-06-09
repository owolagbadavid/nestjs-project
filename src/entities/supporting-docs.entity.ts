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

@Entity({ name: 'supporting_docs' })
export class SupportingDocs {
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

  @ApiProperty()
  @Column({ name: 'document_description' })
  documentDescription: string;

  @ManyToOne('RetirementForm', 'supportingDocs', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'retirement_form_id' })
  retirementForm: RetirementForm;

  @OneToOne('AdvanceForm', 'emailApproval', {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'advance_form_id' })
  advanceForm: AdvanceForm;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @Column({ type: 'bytea', nullable: true })
  file: Uint8Array;
}
