import { ForbiddenException } from '@nestjs/common';
import { AdvanceForm, RetirementForm } from '../entities';

export function setDefaults<Form extends AdvanceForm | RetirementForm>(
  form: Form,
): Form {
  if (!form.user.supervisor)
    throw new ForbiddenException('User has no supervisor');

  form.approvalLevel = 0;
  form.nextApprovalLevel = form.user.supervisor.delegated
    ? form.user.supervisor.delegate.role
    : form.user.supervisor.role;
  form.approvals = [];
  form.preApprovalRemarkByFinance = null;
  // form.delegatedByPD = false;
  form.pushedToFinance = false;
  form.approvedByFin = false;
  form.rejected = false;
  form.remarkByFin = null;
  form.rejectionReason = null;

  return form;
}
