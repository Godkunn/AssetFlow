import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis(tenantId: string) {
    const [
      totalAssets,
      aggregate,
      allocations,
      maintenance,
      transfers,
      returns
    ] = await Promise.all([
      this.prisma.asset.count({ where: { tenantId } }),
      this.prisma.asset.aggregate({
        where: { tenantId },
        _sum: { cost: true }
      }),
      this.prisma.allocation.count({
        where: { tenantId, returnedAt: null }
      }),
      this.prisma.maintenanceTicket.count({
        where: { tenantId, stage: { not: 'Resolved' } }
      }),
      this.prisma.transfer.count({
        where: { tenantId, status: 'Pending' }
      }),
      this.prisma.booking.count({
        where: { tenantId, status: 'Upcoming' }
      })
    ]);

    const totalValue = aggregate._sum.cost || 0;

    return {
      totalAssets,
      totalValue,
      allocations,
      maintenance,
      transfers,
      returns
    };
  }

  async exportReport(tenantId: string) {
    const assets = await this.prisma.asset.findMany({
      where: { tenantId },
      include: { category: true }
    });
    
    return {
      tenantId,
      exportedAt: new Date().toISOString(),
      totalAssetsCount: assets.length,
      assets: assets.map((a: any) => ({
        tag: a.tag,
        name: a.name,
        category: a.category?.name || 'Uncategorized',
        cost: a.cost,
        status: a.status,
        condition: a.condition
      }))
    };
  }
}
