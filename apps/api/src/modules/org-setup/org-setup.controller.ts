import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { OrgSetupService } from './org-setup.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('org')
@UseGuards(JwtAuthGuard, TenantGuard)
export class OrgSetupController {
  constructor(private readonly orgSetupService: OrgSetupService) {}

  @Get('departments')
  getDepartments(@Req() req: any) {
    return this.orgSetupService.getDepartments(req.user.tenantId);
  }

  @Post('departments')
  createDepartment(@Req() req: any, @Body() data: any) {
    return this.orgSetupService.createDepartment(req.user.tenantId, data);
  }

  @Get('categories')
  getCategories(@Req() req: any) {
    return this.orgSetupService.getCategories(req.user.tenantId);
  }

  @Post('categories')
  createCategory(@Req() req: any, @Body() data: any) {
    return this.orgSetupService.createCategory(req.user.tenantId, data);
  }

  @Get('employees')
  getEmployees(@Req() req: any) {
    return this.orgSetupService.getEmployees(req.user.tenantId);
  }

  @Post('employees')
  createEmployee(@Req() req: any, @Body() data: any) {
    return this.orgSetupService.createEmployee(req.user.tenantId, data);
  }

  @Patch('employees/:id')
  updateEmployee(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.orgSetupService.updateEmployee(req.user.tenantId, id, data);
  }
}
