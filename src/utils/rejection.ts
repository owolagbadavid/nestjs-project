import { ForbiddenException } from '@nestjs/common';
import { AdvanceForm, RetirementForm, User } from '../entities';
import { ApprovalOrRejectionDto } from '../forms/dto';
import { Role } from '../types';

export async function reject<Form extends AdvanceForm | RetirementForm>(
  rejectionType: string,
  form: Form,
  user: User,
  rejectionDto: ApprovalOrRejectionDto,
): Promise<Form> {
  console.log(form.supervisorToken, rejectionDto.token);

  if (rejectionType) {
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
