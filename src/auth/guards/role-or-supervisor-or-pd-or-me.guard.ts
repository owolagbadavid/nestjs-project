import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Form, FormType, Role } from '../../entities';
import { FormsService } from '../../forms/forms.service';

@Injectable()
export class MeORSuperiorGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private formsService: FormsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //@what is the required role

    const requiredForm = this.reflector.getAllAndOverride<FormType>('form', [
      context.getHandler(),
      context.getClass(),
    ]);
    let form: Form;

    const request = context.switchToHttp().getRequest();

    const { user } = request;
    if (!user) return false;

    if (requiredForm === FormType.ADVANCE) {
      form = await this.formsService.findOneAdvanceForm(request.params.id, {});
    } else if (requiredForm === FormType.RETIREMENT) {
      form = await this.formsService.findOneRetirementForm(
        request.params.id,
        {},
      );
    }

    // @if admin or finance
    if (user.role === Role.Admin || Role.Finance) return true;
    // @if user owns the form
    if (Number(request.user.id) === form.userId) return true;
    // @if pd or DPd
    if (
      user.role === Role.PD ||
      (user.role === Role.DeputyPD && form.delegatedByPD)
    )
      return true;
    // @if user is owners supervisor
    if (form.user.supervisorId === user.id) return true;

    // @if all fails
    return false;
  }
}
