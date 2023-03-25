import { Injectable } from '@nestjs/common';

import {
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';

@Injectable()
export class FormsService {
  createAdvanceForm(createAdvanceFormDto: CreateAdvanceFormDto) {
    return 'This action adds a new form';
  }

  createRetirementForm(createRetirementFormDto: CreateRetirementFormDto) {
    return 'This action adds a new form';
  }

  findAllAdvanceForms() {
    return `This action returns all forms`;
  }

  findAllRetirementForms() {
    return `This action returns all forms`;
  }

  findOneAdvanceForm(id: number) {
    return `This action returns a #${id} form`;
  }

  findOneRetirementForm(id: number) {
    return `This action returns a #${id} form`;
  }

  updateAdvanceForm(id: number, updateAdvanceFormDto: UpdateAdvanceFormDto) {
    return `This action updates a #${id} form`;
  }

  updateRetirementForm(
    id: number,
    updateRetirementFormDto: UpdateRetirementFormDto,
  ) {
    return `This action updates a #${id} form`;
  }

  removeAdvanceForm(id: number) {
    return `This action removes a #${id} form`;
  }

  removeRetirementForm(id: number) {
    return `This action removes a #${id} form`;
  }

  retireAdvancedForm(
    id: number,
    createRetirementFormDto: CreateRetirementFormDto,
  ) {
    return 'This action retires an advanced form';
  }
}
