import { Controller, Get, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardKpis(@Req() req: any) {
    return this.reportsService.getDashboardKpis(req.user.tenantId);
  }
}
