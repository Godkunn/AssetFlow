import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { AllocationService } from './allocation.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Controller('allocations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AllocationController {
  constructor(private readonly allocationService: AllocationService) {}

  @Get()
  getAllocations(@Req() req: any) {
    return this.allocationService.getAllocations(req.user.tenantId);
  }

  @Post()
  createAllocation(@Req() req: any, @Body() data: any) {
    return this.allocationService.createAllocation(req.user.tenantId, data);
  }

  @Patch(':id/return')
  returnAllocation(@Req() req: any, @Param('id') id: string) {
    return this.allocationService.returnAllocation(req.user.tenantId, id);
  }

  @Get('transfers')
  getTransfers(@Req() req: any) {
    return this.allocationService.getTransfers(req.user.tenantId);
  }

  @Post('transfers')
  requestTransfer(@Req() req: any, @Body() data: any) {
    return this.allocationService.requestTransfer(req.user.tenantId, data);
  }

  @Patch('transfers/:id')
  resolveTransfer(@Req() req: any, @Param('id') id: string, @Body('status') status: string) {
    return this.allocationService.resolveTransfer(req.user.tenantId, id, status);
  }
}
