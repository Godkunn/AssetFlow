import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('audits')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async getAuditCycles(@Req() req: any) {
    return this.auditService.getAuditCycles(req.user.tenantId);
  }

  @Post()
  async createAuditCycle(@Req() req: any, @Body() data: { name: string; scope?: string; dateRange?: string; auditors: string[] }) {
    return this.auditService.createAuditCycle(req.user.tenantId, data);
  }

  @Patch('items/:id/verify')
  async verifyAuditItem(@Req() req: any, @Param('id') itemId: string, @Body('verdict') verdict: string) {
    return this.auditService.verifyAuditItem(req.user.tenantId, itemId, verdict);
  }

  @Patch(':id/close')
  async closeAuditCycle(@Req() req: any, @Param('id') id: string) {
    return this.auditService.closeAuditCycle(req.user.tenantId, id);
  }
}
