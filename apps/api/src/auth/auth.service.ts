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
    // 1. Check if user already exists by resolving tenant first
    // We do an initial lookup by email to find any existing record for this oauth user
    let user = await this.prisma.user.findFirst({
      where: { email: oauthUser.email },
      include: { tenant: true },
    });

    // 2. If user doesn't exist, register them dynamically
    if (!user) {
      const emailDomain = oauthUser.email.split('@')[1].toLowerCase();
      const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
      const isPublicDomain = publicDomains.includes(emailDomain);
      
      let tenant;
      let assignedRole: Role = Role.EMPLOYEE;

      if (isPublicDomain) {
        // Shared fallback tenant for public emails
        tenant = await this.prisma.tenant.findFirst({
          where: { name: 'Default Organization' },
        });

        if (!tenant) {
          tenant = await this.prisma.tenant.create({
            data: {
              name: 'Default Organization',
              domain: 'shared',
            },
          });
        }

        // If this shared tenant is completely empty, make the first user the Admin
        const userCount = await this.prisma.user.count({
          where: { tenantId: tenant.id },
        });
        if (userCount === 0) {
          assignedRole = Role.TENANT_ADMIN;
        }
      } else {
        // Corporate email: look up tenant by domain
        tenant = await this.prisma.tenant.findUnique({
          where: { domain: emailDomain },
        });

        if (!tenant) {
          // Domain doesn't exist yet: provision a new Tenant
          const companyName = emailDomain.split('.')[0].toUpperCase();
          tenant = await this.prisma.tenant.create({
            data: {
              name: `${companyName} Organization`,
              domain: emailDomain,
            },
          });
          // First user of a new corporate domain is the Tenant Admin
          assignedRole = Role.TENANT_ADMIN;
        } else {
          // Corporate domain exists: join as regular Employee
          assignedRole = Role.EMPLOYEE;
        }
      }

      // Create the user under the resolved Tenant and Role
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          name: `${oauthUser.firstName} ${oauthUser.lastName}`,
          role: assignedRole,
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
