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
} from '@nestjs/common';
import { FormsService } from './forms.service';

import {
  ApprovalOrRejectionDto,
  CreateAdvanceFormDto,
  CreateRetirementFormDto,
  UpdateAdvanceFormDto,
  UpdateRetirementFormDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser, Roles } from 'src/decorators';
import { Role, User } from 'src/entities';
import {
  JwtGuard,
  OwnerGuard,
  RolesGuard,
  RolesMaxGuard,
} from 'src/auth/guards';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BodyInterceptor } from 'src/utils/body-interceptor';
import { ApiRes } from 'src/types/api-response';
import { Forms } from 'src/decorators/form.decorator';
import { FormType } from './entities/form.entity';
// import { Readable } from 'stream';

@UseGuards(JwtGuard)
@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // $create advance form
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @Post('advance')
  async createAdvanceForm(
    @Body() createAdvanceFormDto: CreateAdvanceFormDto,
    @GetUser() user: User,
  ): Promise<ApiRes> {
    await this.formsService.createAdvanceForm(createAdvanceFormDto, user);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Form created successfully',
    };
  }

  // $create retirement form
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('retirement')
  async createRetirementForm(
    @Body() createRetirementFormDto: CreateRetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
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
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('advance')
  findAllAdvanceForms() {
    return this.formsService.findAllAdvanceForms();
  }
  // $get all retirement forms
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get('retirement')
  findAllRetirementForms() {
    return this.formsService.findAllRetirementForms();
  }

  // $get single advance form by id
  @Roles(Role.Admin)
  @Get('advance/:id')
  findOneAdvanceForm(@Param('id') id: string) {
    return this.formsService.findOneAdvanceForm(+id);
  }
  // $get single retirement form by id
  @Roles(Role.Admin)
  @Get('retirement/:id')
  async findOneRetirementForm(
    // @Res({ passthrough: true }) response,
    @Param('id') id: string,
  ) {
    return this.formsService.findOneRetirementForm(+id);
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
  @Forms(FormType.ADVANCE)
  @UseGuards(OwnerGuard)
  @Put('advance/:id')
  async editAdvanceForm(
    @Param('id') id: string,
    @Body() updateAdvanceFormDto: UpdateAdvanceFormDto,
    @GetUser() user: User,
  ) {
    await this.formsService.updateAdvanceForm(+id, updateAdvanceFormDto, user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Form updated successfully',
    };
  }
  // $ edit retirement form (PUT)
  @Forms(FormType.RETIREMENT)
  @UseGuards(OwnerGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Put('retirement/:id')
  async editRetirementForm(
    @Param('id') id: string,
    @Body() updateRetirementFormDto: UpdateRetirementFormDto,
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
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('advance/:id')
  removeAdvanceForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeAdvanceForm(+id);
  }
  // $delete retirement form (Hard)
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete('retirement/:id')
  removeRetirementForm(@Param('id', ParseIntPipe) id: number) {
    return this.formsService.removeRetirementForm(+id);
  }
  // $create an advance retirement form (retire an advance)
  @Roles(Role.PD)
  @UseGuards(RolesMaxGuard)
  @UseInterceptors(FilesInterceptor('files'), BodyInterceptor)
  @Post('advance/:id/retire')
  retireAdvanceForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRetirementFormDto: CreateRetirementFormDto,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.formsService.retireAdvancedForm(
      id,
      createRetirementFormDto,
      user,
      files,
    );
  }

  // $approve an advance form
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
  @Post('advance/:id/reject')
  rejectAdvance(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
  ) {
    return this.formsService.rejectAdvance(id, user, rejectionDto);
  }

  // $reject a retirement form
  @Post('retirement/:id/reject')
  rejectRetirement(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() rejectionDto: ApprovalOrRejectionDto,
  ) {
    return this.formsService.rejectRetirement(id, user, rejectionDto);
  }
}
