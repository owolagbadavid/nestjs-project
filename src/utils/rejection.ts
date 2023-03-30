import { ForbiddenException } from '@nestjs/common';
import { AdvanceForm, RetirementForm, Role, User } from 'src/entities';
import { ApprovalOrRejectionDto } from 'src/forms/dto';

export async function reject<Form extends AdvanceForm | RetirementForm>(
  form: Form,
  user: User,
  rejectionDto: ApprovalOrRejectionDto,
): Promise<Form> {
  console.log(form.supervisorToken, rejectionDto.token);

  if (
    // @if supervisor
    (form.approvalLevel === 0 &&
      form.nextApprovalLevel === user.role &&
      form.user.supervisorId === user.id &&
      // $check if supervisor token is valid
      form.supervisorToken === rejectionDto.token) ||
    // @if pd
    (user.role === Role.PD &&
      form.nextApprovalLevel === Role.PD &&
      form.approvalLevel > 0) ||
    (form.nextApprovalLevel === Role.DeputyPD &&
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
    //@if its finance
    if (user.role === Role.Finance) {
      form.remarkByFin = rejectionDto.remark;
    }
    //@if its supervisor
    else if (form.user.supervisorId === user.id) {
      form.supervisorToken = null;
    }

    return form;
  }
  throw new ForbiddenException();
}
