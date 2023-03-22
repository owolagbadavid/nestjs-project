import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RetirementForm } from './retirement-form.entity';

@Entity()
export class SupportingDocs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  documentDescription: string;

  @ManyToOne(
    () => RetirementForm,
    (retirementForm) => retirementForm.supportingDocs,
  )
  retirementForm: RetirementForm;

  @Column({ type: 'bytea', nullable: true })
  file: Uint8Array;
}
