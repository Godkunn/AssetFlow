import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  async getTickets(@Req() req: any) {
    return this.maintenanceService.getTickets(req.user.tenantId);
  }

  @Post()
  async createTicket(@Req() req: any, @Body() data: { assetId: string; issue: string; priority: string }) {
    return this.maintenanceService.createTicket(req.user.tenantId, data);
  }

  @Patch(':id/stage')
  async updateTicketStage(@Req() req: any, @Param('id') id: string, @Body() data: { stage: string; technicianId?: string }) {
    return this.maintenanceService.updateTicketStage(req.user.tenantId, id, data.stage, data.technicianId);
  }
}
