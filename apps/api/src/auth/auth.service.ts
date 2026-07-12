import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthUser(oauthUser: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    // 1. Check if user already exists
    let user = await this.prisma.user.findUnique({
      where: { email: oauthUser.email },
      include: { tenant: true },
    });

    // 2. If user doesn't exist, register them under a new default Tenant
    if (!user) {
      // Find or create default tenant
      let tenant = await this.prisma.tenant.findFirst({
        where: { name: 'Default Organization' },
      });

      if (!tenant) {
        tenant = await this.prisma.tenant.create({
          data: {
            name: 'Default Organization',
            domain: oauthUser.email.split('@')[1],
          },
        });
      }

      // Create the user as Tenant Admin
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          name: `${oauthUser.firstName} ${oauthUser.lastName}`,
          role: Role.TENANT_ADMIN,
          tenantId: tenant.id,
        },
        include: { tenant: true },
      });
    }

    // 3. Generate a JWT session token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
      },
    };
  }
}
