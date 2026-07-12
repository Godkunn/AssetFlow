import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AllocationService {
  constructor(private prisma: PrismaService) {}

  // -- Allocations --
  async getAllocations(tenantId: string) {
    return this.prisma.allocation.findMany({
      where: { tenantId, returnedAt: null },
      include: { asset: true, user: true },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async createAllocation(tenantId: string, data: { assetId: string; userId: string; notes?: string }) {
    // Verify asset is available
    const asset = await this.prisma.asset.findUnique({ where: { id: data.assetId, tenantId } });
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.status !== 'AVAILABLE') throw new BadRequestException('Asset is not available for allocation');

    return this.prisma.$transaction([
      this.prisma.allocation.create({
        data: { ...data, tenantId },
      }),
      this.prisma.asset.update({
        where: { id: data.assetId },
        data: { status: 'ALLOCATED' },
      }),
    ]);
  }

  async returnAllocation(tenantId: string, allocationId: string) {
    const allocation = await this.prisma.allocation.findUnique({ where: { id: allocationId, tenantId } });
    if (!allocation) throw new NotFoundException('Allocation not found');

    return this.prisma.$transaction([
      this.prisma.allocation.update({
        where: { id: allocationId },
        data: { returnedAt: new Date() },
      }),
      this.prisma.asset.update({
        where: { id: allocation.assetId },
        data: { status: 'AVAILABLE' },
      }),
    ]);
  }

  // -- Transfers --
  async getTransfers(tenantId: string) {
    return this.prisma.transfer.findMany({
      where: { tenantId },
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async requestTransfer(tenantId: string, data: { assetId: string; from: string; to: string; reason?: string }) {
    return this.prisma.transfer.create({
      data: { ...data, tenantId, status: 'Pending' },
    });
  }

  async resolveTransfer(tenantId: string, transferId: string, status: string) {
    return this.prisma.transfer.update({
      where: { id: transferId, tenantId },
      data: { status }, // Approved or Rejected
    });
  }
}
