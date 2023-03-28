import { ForbiddenException } from '@nestjs/common';
import { AdvanceForm, RetirementForm, Role, User } from 'src/entities';
import { ApprovalOrRejectionDto } from 'src/forms/dto';

export async function reject<Form extends AdvanceForm | RetirementForm>(
  form: Form,
  user: User,
  rejectionDto: ApprovalOrRejectionDto,
): Promise<Form> {
  if (
    // @if supervisor
    (form.approvalLevel === 0 &&
      form.nextApprovalLevel === user.role &&
      form.user.supervisorId === user.id) ||
    // @if pd
    (user.role === Role.PD &&
      form.nextApprovalLevel === Role.PD &&
      form.approvalLevel > 0) ||
    (form.nextApprovalLevel === Role.PD &&
      form.delegatedByPD &&
      user.role === Role.DeputyPD &&
      form.approvalLevel > 0) ||
    // @if finance
    (form.pushedToFinance &&
      form.nextApprovalLevel === Role.Finance &&
      user.role === Role.Finance)
  ) {
    form.rejected = true;
    form.rejectionReason = rejectionDto.remark;
    form.nextApprovalLevel = null;
    if (user.role === Role.Finance) {
      form.remarkByFin = rejectionDto.remark;
    }

    return form;
  }
  throw new ForbiddenException();
}
