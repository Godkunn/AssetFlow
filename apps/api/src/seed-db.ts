import 'dotenv/config';
import { PrismaClient, Role, AssetStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');
  console.log('Using database connection pool...');

  // 1. Create Tenant (or get if exists)
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'acme.assetflow.io' },
    update: {},
    create: {
      name: 'Acme Corporation',
      domain: 'acme.assetflow.io',
    },
  });
  console.log(`Tenant created/found: ${tenant.name} (${tenant.id})`);

  // Clean old seed data if necessary (optional, but keep it idempotent to avoid duplicate inserts)
  // Let's delete existing data for this tenant to start fresh and clean
  await prisma.notification.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.maintenanceTicket.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.booking.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.allocation.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.asset.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.category.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.user.deleteMany({ where: { tenantId: tenant.id } });
  await prisma.department.deleteMany({ where: { tenantId: tenant.id } });
  console.log('Cleared existing tenant records');

  // 2. Create Departments
  const engDept = await prisma.department.create({
    data: { name: 'Engineering', head: 'Sarah Chen', tenantId: tenant.id },
  });
  const opsDept = await prisma.department.create({
    data: { name: 'Operations', head: 'John Doe', tenantId: tenant.id },
  });
  const hrDept = await prisma.department.create({
    data: { name: 'Human Resources', tenantId: tenant.id },
  });
  console.log('Departments created');

  // 3. Create Users
  // We use the exact email logins mapped to the CredentialsProvider on the frontend
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@assetflow.io',
      name: 'Admin User',
      role: Role.TENANT_ADMIN,
      tenantId: tenant.id,
      departmentId: engDept.id,
    },
  });

  const sarahUser = await prisma.user.create({
    data: {
      email: 'sarah@assetflow.io',
      name: 'Sarah Chen',
      role: Role.ASSET_MANAGER,
      tenantId: tenant.id,
      departmentId: engDept.id,
    },
  });

  const johnUser = await prisma.user.create({
    data: {
      email: 'john@assetflow.io',
      name: 'John Doe',
      role: Role.EMPLOYEE,
      tenantId: tenant.id,
      departmentId: opsDept.id,
    },
  });
  console.log('Users created');

  // 4. Create Categories
  const laptopCat = await prisma.category.create({
    data: { name: 'Laptops', tenantId: tenant.id },
  });
  const monitorCat = await prisma.category.create({
    data: { name: 'Monitors', tenantId: tenant.id },
  });
  const roomCat = await prisma.category.create({
    data: { name: 'Conference Rooms', tenantId: tenant.id },
  });
  const furnitureCat = await prisma.category.create({
    data: { name: 'Furniture', tenantId: tenant.id },
  });
  console.log('Categories created');

  // 5. Create Assets
  const mac16 = await prisma.asset.create({
    data: {
      tag: 'AST-001',
      name: 'MacBook Pro 16"',
      serialNumber: 'C02F2390MD6M',
      status: AssetStatus.ALLOCATED,
      location: 'HQ - Floor 3',
      cost: 2499.99,
      condition: 'Excellent',
      acqDate: new Date('2025-01-15'),
      categoryId: laptopCat.id,
      tenantId: tenant.id,
    },
  });

  const mac14 = await prisma.asset.create({
    data: {
      tag: 'AST-002',
      name: 'MacBook Pro 14"',
      serialNumber: 'C02F4492MD6P',
      status: AssetStatus.AVAILABLE,
      location: 'HQ - Floor 3',
      cost: 1999.99,
      condition: 'Good',
      acqDate: new Date('2025-03-10'),
      categoryId: laptopCat.id,
      tenantId: tenant.id,
    },
  });

  const dell32 = await prisma.asset.create({
    data: {
      tag: 'AST-003',
      name: 'Dell UltraSharp 32"',
      serialNumber: 'CN-084920-A3920',
      status: AssetStatus.AVAILABLE,
      location: 'HQ - Floor 2',
      cost: 799.99,
      condition: 'New',
      acqDate: new Date('2026-02-01'),
      categoryId: monitorCat.id,
      tenantId: tenant.id,
    },
  });

  const roomA = await prisma.asset.create({
    data: {
      tag: 'AST-004',
      name: 'Conference Room A',
      status: AssetStatus.AVAILABLE,
      location: 'HQ - Floor 1',
      cost: 0.0,
      condition: 'Excellent',
      shared: true,
      categoryId: roomCat.id,
      tenantId: tenant.id,
    },
  });

  const chair = await prisma.asset.create({
    data: {
      tag: 'AST-005',
      name: 'Ergonomic Office Chair',
      status: AssetStatus.MAINTENANCE,
      location: 'HQ - Floor 3',
      cost: 350.0,
      condition: 'Fair',
      categoryId: furnitureCat.id,
      tenantId: tenant.id,
    },
  });
  console.log('Assets created');

  // 6. Create Allocations
  await prisma.allocation.create({
    data: {
      assetId: mac16.id,
      userId: adminUser.id,
      tenantId: tenant.id,
      notes: 'Assigned as primary workstation',
    },
  });
  console.log('Allocation created');

  // 7. Create Bookings
  const start = new Date();
  start.setHours(start.getHours() + 2);
  const end = new Date();
  end.setHours(end.getHours() + 3);

  await prisma.booking.create({
    data: {
      assetId: roomA.id,
      userId: adminUser.id,
      tenantId: tenant.id,
      startTime: start,
      endTime: end,
      status: 'Upcoming',
    },
  });
  console.log('Booking created');

  // 8. Create Maintenance Ticket
  await prisma.maintenanceTicket.create({
    data: {
      assetId: chair.id,
      issue: 'Hydraulic cylinder loose, seat height sinks slowly.',
      priority: 'Medium',
      stage: 'Pending',
      tenantId: tenant.id,
    },
  });
  console.log('Maintenance ticket created');

  // 9. Create Notifications
  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      text: 'New maintenance ticket submitted for Ergonomic Office Chair.',
      type: 'Alerts',
      tenantId: tenant.id,
    },
  });
  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      text: 'Asset AST-001 (MacBook Pro 16") has been allocated to you.',
      type: 'Approvals',
      tenantId: tenant.id,
    },
  });
  console.log('Notifications created');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
