import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis(tenantId: string) {
    const totalAssets = await this.prisma.asset.count({ where: { tenantId } });
    
    // Using simple sums/counts for prototype equivalence
    // In reality, cost could be sum:
    const aggregate = await this.prisma.asset.aggregate({
      where: { tenantId },
      _sum: { cost: true }
    });
    const totalValue = aggregate._sum.cost || 0;

    const allocations = await this.prisma.allocation.count({
      where: { tenantId, returnedAt: null }
    });

    const maintenance = await this.prisma.maintenanceTicket.count({
      where: { tenantId, stage: { not: 'Resolved' } }
    });

    const transfers = await this.prisma.transfer.count({
      where: { tenantId, status: 'Pending' }
    });

    const returns = await this.prisma.booking.count({
      where: { tenantId, status: 'Upcoming' }
    }); // using upcoming bookings as a proxy for returns for this demo

    return {
      totalAssets,
      totalValue,
      allocations,
      maintenance,
      transfers,
      returns
    };
  }
}
