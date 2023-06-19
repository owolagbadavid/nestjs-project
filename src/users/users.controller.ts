import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  Query,
  UploadedFile,
  ParseFilePipe,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  DelegationDto,
  UserFilterDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../entities';
import { ApiRes, Role } from '../types';
import {
  JwtGuard,
  RolesGuard,
  RolesMinStrictGuard,
  RolesOrIdGuard,
} from '../auth/guards';
import { GetUser, Roles } from '../decorators';
import { MaxFileSizeValidator } from '../utils';
import { Request } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Users')
@ApiCookieAuth('cookie')
@ApiUnauthorizedResponse({ type: ApiRes })
@ApiForbiddenResponse({ type: ApiRes })
@Roles(Role.Admin)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Post /
  @UseGuards(RolesGuard)
  @ApiCreatedResponse({ type: ApiRes })
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
  ): Promise<ApiRes> {
    // get request host
    const origin = request.headers.origin || request.headers.host;
    return this.usersService.create(createUserDto, origin);
  }

  //Get /
  @ApiOkResponse({ type: User, isArray: true })
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@Query() filterDto: UserFilterDto): Promise<ApiRes> {
    const users = await this.usersService.findAll(filterDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetced succesfully',
      data: users,
    };
  }

  //Get /me
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @Get('me')
  async getMe(@GetUser('id', ParseIntPipe) id: number): Promise<ApiRes> {
    const user = await this.usersService.findOne(+id, {
      department: true,
      unit: true,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User found',
      data: user,
    };
  }

  //$delegate user /delegate
  @ApiOkResponse({ type: ApiRes })
  @UseGuards(RolesMinStrictGuard)
  @Post('delegate')
  @HttpCode(HttpStatus.OK)
  async delegate(@Body() delegationDto: DelegationDto, @GetUser() user: User) {
    await this.usersService.delegateUser(user, delegationDto.delegateId);

    return {
      statusCode: HttpStatus.OK,
      message: `All tasks delegated to User ${delegationDto.delegateId}`,
    };
  }

  //$Undelegate user /undelegate
  @Get('undelegate')
  async undelegate(@GetUser() user: User): Promise<ApiRes> {
    await this.usersService.undelegateUser(user);
    console.log(user);

    return {
      statusCode: HttpStatus.OK,
      message: `All tasks undelegated`,
    };
  }

  //Get /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesOrIdGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(+id, {});
  }

  //Patch /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  //Delete /:id
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @ApiOkResponse({ type: User })
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.remove(+id);
  }

  //Upload profile picture
  @ApiOkResponse({ type: ApiRes })
  @ApiBadRequestResponse({ type: ApiRes })
  @Patch('upload-profile-picture')
  async uploadProfilePicture(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 3000000 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiRes> {
    const profilePicture = await this.usersService.uploadProfilePicture(
      user,
      file,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Profile picture uploaded successfully',
      data: profilePicture,
    };
  }
}
