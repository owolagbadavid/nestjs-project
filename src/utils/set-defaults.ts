import { AdvanceForm, RetirementForm } from 'src/entities';

export function setDefaults<Form extends AdvanceForm | RetirementForm>(
  form: Form,
): Form {
  form.approvalLevel = 0;
  form.nextApprovalLevel = form.user.supervisor.role;
  form.approvals = [];
  form.preApprovalRemarkByFinance = null;
  form.delegatedByPD = false;
  form.pushedToFinance = false;
  form.approvedByFin = false;
  form.rejected = false;
  form.remarkByFin = null;

  return form;
}
