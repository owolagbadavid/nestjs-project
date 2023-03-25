import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdvanceForm } from './advance-form.entity';
import { Products } from 'src/entities/products.enum';

@Entity()
export class AdvanceDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  advanceFormId: number;

  @ManyToOne(() => AdvanceForm, (advanceForm) => advanceForm.details)
  advanceForm: AdvanceForm;

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
