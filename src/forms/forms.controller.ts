import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Put,
  HttpStatus,
  Query,
  ClassSerializerInterceptor,
  ParseFilePipe,
  HttpCode,
  ParseBoolPipe,
  UploadedFile,
} from '@nestjs/common';
import { FormsService } from './forms.service';

import {
  ApprovalOrRejectionDto,
  AdvanceFormDto,
  RetirementFormDto,
  FormFilterDto,
  // RelationDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  GetUser,
  Roles,
  Forms,
  GetForm,
  GetApproval,
  GetPD,
} from '../decorators';
import { AdvanceForm, RetirementForm, User } from '../entities';
import { Role, FormType, ApiRes } from '../types';
import {
  JwtGuard,
  MeORSuperiorGuard,
  OwnerGuard,
  RolesGuard,
  RolesMaxGuard,
  RolesMinGuard,
  ApprovalGuard,
} from '../auth/guards';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MaxFileSizeValidator, BodyInterceptor } from '../utils';

@ApiCookieAuth('cookie')
@ApiUnauthorizedResponse({ type: ApiRes })
@ApiForbiddenResponse({ type: ApiRes })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // $create advance form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @UseInterceptors(FileInterceptor('emailApproval'), BodyInterceptor)
  @Post('advance')
  async createAdvanceForm(
    @Body() createAdvanceFormDto: AdvanceFormDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    emailApproval: Express.Multer.File,
  ): Promise<ApiRes> {
    console.log(createAdvanceFormDto);

    await this.formsService.createAdvanceForm(
      createAdvanceFormDto,
      user,
      emailApproval,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form created successfully',
    };
  }

  // $create retirement form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('retirement')
  async createRetirementForm(
    @Body() createRetirementFormDto: RetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ApiRes> {
    await this.formsService.createRetirementForm(
      createRetirementFormDto,
      user,
      files,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form created successfully',
    };
  }

  // $get all advance forms
  @ApiOkResponse({ isArray: true, type: AdvanceForm })
  @Roles(Role.DeputyPD)
  @UseGuards(RolesMinGuard)
  @Get('advance')
  findAllAdvanceForms(@Query() formFilterDto: FormFilterDto) {
    return this.formsService.findAllAdvanceForms(formFilterDto, {});
  }

  // $get all retirement forms
  @ApiOkResponse({ isArray: true, type: RetirementForm })
  @Roles(Role.DeputyPD)
  @UseGuards(RolesMinGuard)
  @Get('retirement')
  findAllRetirementForms(@Query() formFilterDto: FormFilterDto) {
    return this.formsService.findAllRetirementForms(formFilterDto, {});
  }

  // $get my directReports advance form
  @ApiOkResponse({ isArray: true, type: AdvanceForm })
  @Get('advance/myDirectReports')
  getMyDirectReportsAdvanceForms(
    @GetUser() user: User,
    @Query() formFilterDto: FormFilterDto,
  ) {
    return this.formsService.getMyDirectReportsAdvanceForms(
      user,
      formFilterDto,
    );
  }

  // $get my directReports retirement form
  @ApiOkResponse({ isArray: true, type: RetirementForm })
  @Get('retirement/myDirectReports')
  getMyDirectReportsRetirementForms(
    @GetUser() user: User,
    @Query() formFilterDto: FormFilterDto,
  ) {
    return this.formsService.getMyDirectReportsRetirementForms(
      user,
      formFilterDto,
    );
  }

  // $get single advance form by id
  @ApiOkResponse({ type: AdvanceForm })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.ADVANCE)
  @UseGuards(MeORSuperiorGuard)
  @Get('advance/:id')
  findOneAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    // @Query() relationDto: RelationDto,
    @GetForm() form: AdvanceForm,
  ) {
    return form;
  }

  // $get single retirement form by id
  @ApiOkResponse({ type: RetirementForm })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.RETIREMENT)
  @UseGuards(MeORSuperiorGuard)
  @Get('retirement/:id')
  async findOneRetirementForm(
    // @Res({ passthrough: true }) response,
    @Param('id', ParseIntPipe) id: number,
    // @Query() relationDto: RelationDto,
    @GetForm() form: RetirementForm,
  ) {
    return form;
  }

  // $edit advance form (PUT)
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiOkResponse({ type: ApiRes })
  @Forms(FormType.ADVANCE)
  @UseGuards(OwnerGuard)
  @Put('advance/:id')
  async editAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdvanceFormDto: AdvanceFormDto,
    @GetUser() user: User,
    @GetForm() form: AdvanceForm,
  ) {
    await this.formsService.updateAdvanceForm(
      +id,
      updateAdvanceFormDto,
      user,
      form,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Form updated successfully',
    };
  }

  // $ edit retirement form (PUT)
  @ApiOkResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiConsumes('multipart/form-data')
  @Forms(FormType.RETIREMENT)
  @UseGuards(OwnerGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Put('retirement/:id')
  async editRetirementForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRetirementFormDto: RetirementFormDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser() user: User,
    @GetForm() form: RetirementForm,
  ) {
    await this.formsService.updateRetirementForm(
      +id,
      updateRetirementFormDto,
      files,
      user,
      form,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Form updated successfully',
    };
  }

  // $delete advance form (Hard)
  @ApiOkResponse({ type: AdvanceForm })
  @ApiBadRequestResponse({ type: ApiRes })
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }

  // $delete retirement form (Hard)
  @ApiOkResponse({ type: RetirementForm })
  @ApiBadRequestResponse({ type: ApiRes })
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('retirement/:id')
  removeRetirementForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeRetirementForm(+id);
  }

  // $create an advance retirement form (retire an advance)
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @Forms(FormType.RETIREMENT)
  @UseGuards(OwnerGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('advance/:id/retire')
  async retireAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRetirementFormDto: RetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
    @GetForm() form: AdvanceForm,
  ) {
    await this.formsService.retireAdvancedForm(
      id,
      createRetirementFormDto,
      user,
      files,
      form,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Advance retirement form created',
    };
  }

  // $approve an advance form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.ADVANCE)
  @UseGuards(ApprovalGuard)
  @Post('advance/:id/approve')
  async approveAdvance(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() approvalDto: ApprovalOrRejectionDto,
    @GetApproval() approval: string,
    @GetPD() pd: User,
  ): Promise<ApiRes> {
    await this.formsService.approveAdvance(id, user, approvalDto, approval, pd);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Advance Form Approved',
    };
  }

  // $approve a retirement form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.RETIREMENT)
  @UseGuards(ApprovalGuard)
  @Post('retirement/:id/approve')
  async approveRetirement(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() approvalDto: ApprovalOrRejectionDto,
    @GetApproval() approval: string,
    @GetPD() pd: User,
  ) {
    await this.formsService.approveRetirement(
      id,
      user,
      approvalDto,
      approval,
      pd,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Retirement Form Approved',
    };
  }

  // $reject a advance form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.ADVANCE)
  @UseGuards(ApprovalGuard)
  @Post('advance/:id/reject')
  async rejectAdvance(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
    @GetApproval() approval: string,
  ) {
    await this.formsService.rejectAdvance(id, user, rejectionDto, approval);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form rejected',
    };
  }

  // $reject a retirement form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Forms(FormType.RETIREMENT)
  @UseGuards(ApprovalGuard)
  @Post('retirement/:id/reject')
  async rejectRetirement(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
    @GetApproval() approval: string,
  ) {
    await this.formsService.rejectRetirement(id, user, rejectionDto, approval);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form rejected',
    };
  }

  // $finance preApproval remark
  @ApiOkResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Roles(Role.Finance)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('retirement/:id/remark')
  async retirementRemark(
    @Body('remark') remark: string,
    @Body('financeGoAhead', ParseBoolPipe) financeGoAhead: boolean,
    @Param('id') id: number,
  ) {
    await this.formsService.retirementRemark(id, remark, financeGoAhead);

    return {
      statusCode: HttpStatus.OK,
      message: 'Remark made',
    };
  }

  // $finance preApproval remark
  @ApiOkResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Roles(Role.Finance)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('advance/:id/remark')
  async advanceRemark(
    @Body('remark') remark: string,
    @Body('financeGoAhead', ParseBoolPipe) financeGoAhead: boolean,
    @Param('id') id: number,
  ) {
    await this.formsService.advanceRemark(id, remark, financeGoAhead);

    return {
      statusCode: HttpStatus.OK,
      message: 'Remark made',
    };
  }

  // // $pd delegates to Deputy
  // @ApiOkResponse({ type: ApiRes })
  // @ApiBadRequestResponse({ type: ApiRes })
  // @Roles(Role.PD)
  // @UseGuards(RolesGuard)
  // @Get('advance/:id/delegate')
  // async delegateAdvanceApproval(@Param('id') id: number) {
  //   await this.formsService.delegateAdvanceApproval(id);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Delegated',
  //   };
  // }

  // // $pd delegates to Deputy
  // @ApiOkResponse({ type: ApiRes })
  // @ApiBadRequestResponse({ type: ApiRes })
  // @Roles(Role.PD)
  // @UseGuards(RolesGuard)
  // @Get('retirement/:id/delegate')
  // async delegateRetirementApproval(@Param('id') id: number) {
  //   await this.formsService.delegateRetirementApproval(id);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Delegated',
  //   };
  // }
}
