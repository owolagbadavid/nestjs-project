import { AdvanceForm, RetirementForm } from '../entities';

export type Form = AdvanceForm | RetirementForm;

export enum FormType {
  ADVANCE = 'advance',
  RETIREMENT = 'retirement',
}
