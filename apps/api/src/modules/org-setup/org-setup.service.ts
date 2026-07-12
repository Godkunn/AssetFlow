import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrgSetupService {
  constructor(private prisma: PrismaService) {}

  // -- Departments --
  async getDepartments(tenantId: string) {
    return this.prisma.department.findMany({
      where: { tenantId },
      include: { children: true }, 
    });
  }

  async createDepartment(tenantId: string, data: { name: string; head?: string; parentId?: string }) {
    return this.prisma.department.create({
      data: { ...data, tenantId },
    });
  }

  // -- Categories --
  async getCategories(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId },
    });
  }

  async createCategory(tenantId: string, data: { name: string; extra?: string }) {
    return this.prisma.category.create({
      data: { ...data, tenantId },
    });
  }

  // -- Employees --
  async getEmployees(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId },
      include: { department: true },
    });
  }

  async updateEmployee(tenantId: string, userId: string, data: { departmentId?: string; role?: any }) {
    return this.prisma.user.update({
      where: { id: userId, tenantId },
      data,
    });
  }
}
