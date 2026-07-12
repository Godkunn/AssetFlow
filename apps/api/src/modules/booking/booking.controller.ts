import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  async getBookings(@Req() req: any) {
    return this.bookingService.getBookings(req.user.tenantId);
  }

  @Post()
  async createBooking(@Req() req: any, @Body() data: { assetId: string; userId: string; startTime: string; endTime: string }) {
    return this.bookingService.createBooking(req.user.tenantId, {
      assetId: data.assetId,
      userId: data.userId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    });
  }

  @Patch(':id/cancel')
  async cancelBooking(@Req() req: any, @Param('id') id: string) {
    return this.bookingService.cancelBooking(req.user.tenantId, id);
  }
}
