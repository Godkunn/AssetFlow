import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async getAssets(tenantId: string, status?: string) {
    const where: any = { tenantId };
    if (status && status !== 'All Assets') {
      where.status = status.toUpperCase();
    }
    return this.prisma.asset.findMany({
      where,
      include: { category: true, allocations: { include: { user: true }, orderBy: { assignedAt: 'desc' }, take: 1 } },
    });
  }

  async getAssetById(tenantId: string, assetId: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId, tenantId },
      include: { category: true, allocations: { include: { user: true } }, maintenanceTickets: true },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async createAsset(tenantId: string, data: any) {
    return this.prisma.asset.create({
      data: { ...data, tenantId },
    });
  }

  async updateAsset(tenantId: string, assetId: string, data: any) {
    return this.prisma.asset.update({
      where: { id: assetId, tenantId },
      data,
    });
  }

  async deleteAsset(tenantId: string, assetId: string) {
    return this.prisma.asset.delete({
      where: { id: assetId, tenantId },
    });
  }
}
