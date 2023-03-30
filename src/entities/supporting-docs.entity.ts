import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RetirementForm } from './retirement-form.entity';
import { ApiProperty } from '@nestjs/swagger';

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

  @ManyToOne(
    () => RetirementForm,
    (retirementForm) => retirementForm.supportingDocs,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE', orphanedRowAction: 'delete' },
  )
  retirementForm: RetirementForm;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @Column({ type: 'bytea', nullable: true })
  file: Uint8Array;
}
