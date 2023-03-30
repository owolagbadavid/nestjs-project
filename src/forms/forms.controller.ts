import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  // StreamableFile,
  // Res,
  Put,
  HttpStatus,
  Query,
  ClassSerializerInterceptor,
  ParseFilePipe,
} from '@nestjs/common';
import { FormsService } from './forms.service';

import {
  ApprovalOrRejectionDto,
  AdvanceFormDto,
  RetirementFormDto,
  FilterDto,
  RelationDto,
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
import { GetUser, Roles } from 'src/decorators';
import { AdvanceForm, RetirementForm, Role, User } from 'src/entities';
import {
  JwtGuard,
  MeORSuperiorGuard,
  OwnerGuard,
  RolesGuard,
  RolesMaxGuard,
  RolesMinGuard,
} from 'src/auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BodyInterceptor } from 'src/utils/body-interceptor';
import { ApiRes } from 'src/types/api-response';
import { Forms } from 'src/decorators/form.decorator';
import { FormType } from '../entities/form.entity';
import { MaxFileSizeValidator } from 'src/utils';
// import { Readable } from 'stream';

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
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @Post('advance')
  async createAdvanceForm(
    @Body() createAdvanceFormDto: AdvanceFormDto,
    @GetUser() user: User,
  ): Promise<ApiRes> {
    await this.formsService.createAdvanceForm(createAdvanceFormDto, user);

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
  findAllAdvanceForms(@Query() filterDto: FilterDto) {
    return this.formsService.findAllAdvanceForms(filterDto);
  }

  // $get all retirement forms
  @ApiOkResponse({ isArray: true, type: RetirementForm })
  @Roles(Role.DeputyPD)
  @UseGuards(RolesMinGuard)
  @Get('retirement')
  findAllRetirementForms(@Query() filterDto: FilterDto) {
    return this.formsService.findAllRetirementForms(filterDto);
  }

  // $get my directReports advance form
  @ApiOkResponse({ isArray: true, type: AdvanceForm })
  @Get('advance/myDirectReports')
  getMyDirectReportsAdvanceForms(
    @GetUser() user: User,
    @Query() filterDto: FilterDto,
  ) {
    return this.formsService.getMyDirectReportsAdvanceForms(user, filterDto);
  }

  // $get my directReports retirement form
  @ApiOkResponse({ isArray: true, type: RetirementForm })
  @Get('retirement/myDirectReports')
  getMyDirectReportsRetirementForms(
    @GetUser() user: User,
    @Query() filterDto: FilterDto,
  ) {
    return this.formsService.getMyDirectReportsRetirementForms(user, filterDto);
  }

  // $get single advance form by id
  @ApiOkResponse({ type: AdvanceForm })
  @Forms(FormType.ADVANCE)
  @UseGuards(MeORSuperiorGuard)
  @Get('advance/:id')
  findOneAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Query() relationDto: RelationDto,
  ) {
    return this.formsService.findOneAdvanceForm(+id, relationDto);
  }

  // $get single retirement form by id
  @ApiOkResponse({ type: RetirementForm })
  @Forms(FormType.RETIREMENT)
  @UseGuards(MeORSuperiorGuard)
  @Get('retirement/:id')
  async findOneRetirementForm(
    // @Res({ passthrough: true }) response,
    @Param('id', ParseIntPipe) id: number,
    @Query() relationDto: RelationDto,
  ) {
    return this.formsService.findOneRetirementForm(+id, relationDto);
    // console.log(file);

    // const stream = Readable.from(file);
    // response.set({
    //   'Content-Disposition': 'attachment; filename="image.png"',
    //   'Content-Type': 'image',
    // });
    // console.log('mike');

    // return new StreamableFile(stream);
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
  ) {
    await this.formsService.updateAdvanceForm(+id, updateAdvanceFormDto, user);
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
  ) {
    await this.formsService.updateRetirementForm(
      +id,
      updateRetirementFormDto,
      files,
      user,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Form updated successfully',
    };
  }

  // $delete advance form (Hard)
  @ApiOkResponse({ type: AdvanceForm })
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }

  // $delete retirement form (Hard)
  @ApiOkResponse({ type: RetirementForm })
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
  ) {
    await this.formsService.retireAdvancedForm(
      id,
      createRetirementFormDto,
      user,
      files,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Advance retirement form created',
    };
  }

  // $approve an advance form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Post('advance/:id/approve')
  async approveAdvance(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() approvalDto: ApprovalOrRejectionDto,
  ): Promise<ApiRes> {
    await this.formsService.approveAdvance(id, user, approvalDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Advance Form Approved',
    };
  }

  // $approve a retirement form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Post('retirement/:id/approve')
  async approveRetirement(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() approvalDto: ApprovalOrRejectionDto,
  ) {
    await this.formsService.approveRetirement(id, user, approvalDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Retirement Form Approved',
    };
  }

  // $reject a advance form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Post('advance/:id/reject')
  async rejectAdvance(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
  ) {
    await this.formsService.rejectAdvance(id, user, rejectionDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form rejected',
    };
  }

  // $reject a retirement form
  @ApiCreatedResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Post('retirement/:id/reject')
  async rejectRetirement(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
  ) {
    await this.formsService.rejectRetirement(id, user, rejectionDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form rejected',
    };
  }

  // $finance preApproval remark
  @Roles(Role.Finance)
  @UseGuards(RolesGuard)
  @Post('retirement/:id/remark')
  retirementRemark(@Body('remark') remark: string, @Param('id') id: number) {
    return this.formsService.retirementRemark(id, remark);
  }

  // $finance preApproval remark
  @Roles(Role.Finance)
  @UseGuards(RolesGuard)
  @Post('advance/:id/remark')
  advanceRemark(@Body('remark') remark: string, @Param('id') id: number) {
    return this.formsService.advanceRemark(id, remark);
  }

  // $pd delegates to Deputy
  @Roles(Role.PD)
  @UseGuards(RolesGuard)
  @Get('advance/:id/delegate')
  delegateAdvanceApproval(@Param('id') id: number) {
    return this.formsService.delegateAdvanceApproval(id);
  }

  // $pd delegates to Deputy
  @Roles(Role.PD)
  @UseGuards(RolesGuard)
  @Get('retirement/:id/delegate')
  delegateRetirementApproval(@Param('id') id: number) {
    return this.formsService.delegateRetirementApproval(id);
  }
}
