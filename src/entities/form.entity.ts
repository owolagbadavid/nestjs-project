import { AdvanceForm, RetirementForm } from './';

export type Form = AdvanceForm | RetirementForm;

export enum FormType {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}
