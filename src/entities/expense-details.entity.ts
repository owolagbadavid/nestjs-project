import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Products } from 'src/entities/products.enum';
import { RetirementForm } from './retirement-form.entity';

@Entity()
export class ExpenseDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  retirementFormId: number;

  @ManyToOne(() => RetirementForm, (retirementForm) => retirementForm.details)
  retirementForm: RetirementForm;

  @Column({
    type: 'enum',
    enum: Products,
  })
  product: Products;

  @Column()
  rate: number;

  @Column()
  amount: number;

  @Column()
  number: number;

  @Column()
  remark: string;
}
