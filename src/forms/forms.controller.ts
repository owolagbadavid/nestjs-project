import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FormsService } from './forms.service';

import {
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('advance')
  createAdvanceForm(@Body() createAdvanceFormDto: CreateAdvanceFormDto) {
    return this.formsService.createAdvanceForm(createAdvanceFormDto);
  }

  @Post('retirement')
  createRetirementForm(
    @Body() createRetirementFormDto: CreateRetirementFormDto,
  ) {
    return this.formsService.createRetirementForm(createRetirementFormDto);
  }

  @Get('advance')
  findAllAdvanceForms() {
    return this.formsService.findAllAdvanceForms();
  }

  @Get('retirement')
  findAllRetirementForms() {
    return this.formsService.findAllRetirementForms();
  }

  @Get('advance/:id')
  findOneAdvanceForm(@Param('id') id: string) {
    return this.formsService.findOneAdvanceForm(+id);
  }

  @Get('retirement/:id')
  findOneRetirementForm(@Param('id') id: string) {
    return this.formsService.findOneRetirementForm(+id);
  }

  @Patch('advance/:id')
  editAdvanceForm(
    @Param('id') id: string,
    @Body() updateAdvanceFormDto: UpdateAdvanceFormDto,
  ) {
    return this.formsService.updateAdvanceForm(+id, updateAdvanceFormDto);
  }

  @Patch('retirement/:id')
  editRetirementForm(
    @Param('id') id: string,
    @Body() updateRetirementFormDto: UpdateRetirementFormDto,
  ) {
    return this.formsService.updateRetirementForm(+id, updateRetirementFormDto);
  }

  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }

  @Delete('retirement/:id')
  removeRetirementForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeRetirementForm(+id);
  }

  @Post('advance/:id/retire')
  retireAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRetirementFormDto: CreateRetirementFormDto,
  ) {
    return this.formsService.retireAdvancedForm(id, createRetirementFormDto);
  }
}
