import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';
import { AdminsService } from './admins.service';
import { AdminEntity } from './entities/admin.entity';

@Controller('/admin/admins/')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('current')
  @UseGuards(AdminAuthGuard)
  async current(@Request() req): Promise<{ data: AdminEntity }> {
    const item = req.admin;
    return { data: plainToInstance(AdminEntity, item) };
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  async findAll(@Request() req): Promise<{ data: AdminEntity[] }> {
    const items = await this.adminsService.findAll();
    return { data: plainToInstance(AdminEntity, items) };
  }
}
