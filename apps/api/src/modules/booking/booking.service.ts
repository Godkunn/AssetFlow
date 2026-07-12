import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async getBookings(tenantId: string) {
    return this.prisma.booking.findMany({
      where: { tenantId },
      include: {
        asset: true,
        user: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async createBooking(tenantId: string, data: { assetId: string; userId: string; startTime: Date; endTime: Date }) {
    return this.prisma.booking.create({
      data: {
        ...data,
        tenantId,
        status: 'Upcoming',
      },
    });
  }

  async cancelBooking(tenantId: string, id: string) {
    return this.prisma.booking.update({
      where: { id, tenantId },
      data: { status: 'Cancelled' },
    });
  }
}
