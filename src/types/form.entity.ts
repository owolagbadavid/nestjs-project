import { AdvanceForm, RetirementForm } from '../entities';

export type Form = AdvanceForm | RetirementForm;

export enum FormType {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}

export type FormEntity<T> = T extends AdvanceForm
  ? AdvanceForm
  : T extends RetirementForm
  ? RetirementForm
  : never;
