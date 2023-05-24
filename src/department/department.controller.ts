import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

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
import { ApiRes, Role } from '../types';
import { Department } from '../entities';
import { Roles } from '../decorators';
import { JwtGuard, RolesGuard } from '../auth/guards';

@ApiTags('Department')
@ApiCookieAuth('cookie')
@ApiUnauthorizedResponse({ type: ApiRes })
@ApiForbiddenResponse({ type: ApiRes })
@UseGuards(JwtGuard)
@Roles(Role.Admin)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiCreatedResponse({ type: Department })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Post()
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.create(createDepartmentDto);
  }

  @ApiOkResponse({ type: Department, isArray: true })
  @Get()
  async findAll(): Promise<ApiRes> {
    const departments = await this.departmentService.findAll();
    return {
      statusCode: 200,
      message: 'Get all departments successfully',
      data: departments,
    };
  }

  @ApiOkResponse({ type: Department })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Department> {
    return this.departmentService.findOne(+id);
  }

  @ApiOkResponse({ type: Department })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @ApiOkResponse({ type: Department })
  @ApiBadRequestResponse({ type: ApiRes })
  @ApiNotFoundResponse({ type: ApiRes })
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Department> {
    return this.departmentService.remove(+id);
  }
}
