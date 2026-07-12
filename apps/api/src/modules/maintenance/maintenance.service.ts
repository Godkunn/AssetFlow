import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async getTickets(tenantId: string) {
    return this.prisma.maintenanceTicket.findMany({
      where: { tenantId },
      include: {
        asset: true,
        technician: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTicket(tenantId: string, data: { assetId: string; issue: string; priority: string }) {
    // Also update asset status to MAINTENANCE
    const ticket = await this.prisma.maintenanceTicket.create({
      data: {
        ...data,
        tenantId,
        stage: 'Pending',
      },
    });

    await this.prisma.asset.update({
      where: { id: data.assetId },
      data: { status: 'MAINTENANCE' },
    });

    return ticket;
  }

  async updateTicketStage(tenantId: string, id: string, stage: string, technicianId?: string) {
    const ticket = await this.prisma.maintenanceTicket.update({
      where: { id, tenantId },
      data: { stage, technicianId },
    });

    // If resolved, return asset to AVAILABLE
    if (stage === 'Resolved') {
      await this.prisma.asset.update({
        where: { id: ticket.assetId },
        data: { status: 'AVAILABLE' },
      });
    }

    return ticket;
  }
}
