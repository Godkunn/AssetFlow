import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async getAuditCycles(tenantId: string) {
    return this.prisma.auditCycle.findMany({
      where: { tenantId },
      include: {
        items: {
          include: { asset: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAuditCycle(tenantId: string, data: { name: string; scope?: string; dateRange?: string; auditors: string[] }) {
    // 1. Create the cycle
    const cycle = await this.prisma.auditCycle.create({
      data: {
        ...data,
        tenantId,
      },
    });

    // 2. Fetch all assets (or scoped assets if scope provided)
    // For simplicity, we just fetch all available/allocated assets
    const assetsToAudit = await this.prisma.asset.findMany({
      where: { tenantId, status: { in: ['AVAILABLE', 'ALLOCATED', 'MAINTENANCE'] } },
    });

    // 3. Create AuditItems for each asset
    if (assetsToAudit.length > 0) {
      const items = assetsToAudit.map(asset => ({
        auditCycleId: cycle.id,
        assetId: asset.id,
        expected: asset.location || 'Unknown',
        verdict: 'Pending',
        tenantId,
      }));
      await this.prisma.auditItem.createMany({ data: items });
    }

    return this.prisma.auditCycle.findUnique({
      where: { id: cycle.id },
      include: { items: true },
    });
  }

  async verifyAuditItem(tenantId: string, itemId: string, verdict: string) {
    return this.prisma.auditItem.update({
      where: { id: itemId, tenantId },
      data: { verdict },
    });
  }

  async closeAuditCycle(tenantId: string, cycleId: string) {
    return this.prisma.auditCycle.update({
      where: { id: cycleId, tenantId },
      data: { closed: true },
    });
  }
}
