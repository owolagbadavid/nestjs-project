import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Form, FormType } from '../../types/form.entity';
import { FormsService } from '../../forms/forms.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ApprovalOrRejectionDto, FormRelationDto } from '../../forms/dto';
import { Role } from '../../types';
import { UsersService } from '../../users/users.service';

@Injectable()
export class ApprovalGuard implements CanActivate {
  constructor(
    private formsService: FormsService,
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @required form type

    const requiredForm = this.reflector.getAllAndOverride<FormType>('form', [
      context.getHandler(),
      context.getClass(),
    ]);

    let form: Form;
    const request = context.switchToHttp().getRequest();
    request.approval = null;
    let formId: number;
    try {
      formId = parseInt(request.params.id);
      if (formId % 1 !== 0) throw new Error();
      request.params.id = formId;
    } catch (error) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }

    const { user } = request;

    if (!user) return false;
    const [pd] = await this.usersService.findStaff(Role.PD);

    // get query params
    const { query } = request;
    let formRelationDto: FormRelationDto = {};

    if (query) {
      // transform query params using class-transformer with class
      formRelationDto = plainToInstance(FormRelationDto, query);

      // validate query params with class-validator
      const errors = await validate(formRelationDto, {
        validationError: { target: false, value: false },
      });
      console.log(errors);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors.map((e) => Object.values(e.constraints).toString()),
        );
      }
    }

    const { body } = request;
    let approvalDto: ApprovalOrRejectionDto;

    if (body) {
      // transform query params using class-transformer with class
      approvalDto = plainToInstance(ApprovalOrRejectionDto, body);

      // validate query params with class-validator
      const errors = await validate(formRelationDto, {
        validationError: { target: false, value: false },
      });
      console.log(errors);
      if (errors.length > 0) {
        throw new BadRequestException(
          errors.map((e) => Object.values(e.constraints).toString()),
        );
      }
    }

    if (requiredForm === FormType.ADVANCE) {
      form = await this.formsService.findOneAdvanceForm(formId, {
        user: { supervisor: { delegate: true } },
        ...formRelationDto,
      });
    } else if (requiredForm === FormType.RETIREMENT) {
      form = await this.formsService.findOneRetirementForm(formId, {
        user: true,
        ...formRelationDto,
      });
    }
    console.log(formRelationDto, form);

    if (
      form.approvalLevel === 0 &&
      form.nextApprovalLevel === user.role &&
      (form.user.supervisorId === user.id ||
        form.user.supervisor.delegateId === user.id) &&
      form.supervisorToken === approvalDto.token
    ) {
      request.approval = 'supervisor';
    } else if (
      (user.role === Role.PD &&
        form.nextApprovalLevel === Role.PD &&
        form.approvalLevel > 0) ||
      (form.nextApprovalLevel === user.role &&
        form.approvalLevel > 0 &&
        pd.delegateId == user.id)
    ) {
      request.approval = 'pd';
    } else if (
      form.pushedToFinance &&
      form.nextApprovalLevel === Role.Finance &&
      user.role === Role.Finance
    ) {
      request.approval = 'finance';
    } else {
      return false;
    }
    request.form = form;
    request.pd = pd;
    return true;
  }
}
