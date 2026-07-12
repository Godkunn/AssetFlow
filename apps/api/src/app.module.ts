import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from './common/guards/rbac.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { OrgSetupModule } from './modules/org-setup/org-setup.module';
import { AssetsModule } from './modules/assets/assets.module';
import { AllocationModule } from './modules/allocation/allocation.module';
import { BookingModule } from './modules/booking/booking.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    OrgSetupModule,
    AssetsModule,
    AllocationModule,
    BookingModule,
    MaintenanceModule,
    AuditModule,
    ReportsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    }
  ],
})
export class AppModule {}
