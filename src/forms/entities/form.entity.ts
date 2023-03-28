import { AdvanceForm, RetirementForm } from 'src/entities';

export type Form = AdvanceForm | RetirementForm;

export enum FormType {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}
