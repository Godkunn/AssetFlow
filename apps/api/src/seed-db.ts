import 'dotenv/config';
import { PrismaClient, Role, AssetStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Indian Name Datasets for realistic generation
const FIRST_NAMES = [
  'Aarav', 'Arjun', 'Dev', 'Ishan', 'Vihaan', 'Kabir', 'Sai', 'Aditya', 'Krishna', 'Rohan',
  'Ananya', 'Diya', 'Ishita', 'Kiara', 'Meera', 'Myra', 'Neha', 'Riya', 'Saisha', 'Tanvi',
  'Aarohi', 'Advait', 'Vivaan', 'Shreyas', 'Parth', 'Aravind', 'Pranav', 'Nikhil', 'Harish',
  'Karthik', 'Rajesh', 'Sanjay', 'Vinay', 'Amit', 'Sunil', 'Anil', 'Pooja', 'Sneha', 'Shreya',
  'Divya', 'Kavitha', 'Priya', 'Swati', 'Deepa', 'Geetha', 'Sandeep', 'Vikas', 'Gaurav', 'Rahul',
  'Siddharth', 'Rohit', 'Sachin', 'Virat', 'Ramesh', 'Suresh', 'Abhishek', 'Manish', 'Kunal',
  'Akash', 'Aditi', 'Kriti', 'Megha', 'Payal', 'Rashmi', 'Kiran', 'Jyoti', 'Shweta', 'Nisha'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Iyer', 'Nair', 'Gupta', 'Mehta', 'Reddy', 'Rao', 'Joshi',
  'Singh', 'Kumar', 'Sen', 'Roy', 'Bose', 'Chatterjee', 'Banerjee', 'Mukherjee', 'Das', 'Pillai',
  'Menon', 'Kulkarni', 'Deshmukh', 'Patil', 'Hegde', 'Bhat', 'Shenoy', 'Prabhu', 'Naik', 'Shinde',
  'Yadav', 'Choudhury', 'Mishra', 'Trivedi', 'Pandey', 'Dwivedi', 'Grover', 'Malhotra', 'Kapoor', 'Khanna'
];

const DEPARTMENTS = [
  { name: 'Engineering', head: 'Rajesh Sharma' },
  { name: 'Operations', head: 'Sneha Patel' },
  { name: 'Human Resources', head: 'Ananya Iyer' },
  { name: 'Finance', head: 'Amit Gupta' },
  { name: 'Facilities', head: 'Sanjay Nair' }
];

const ASSETS_POOL = [
  { name: 'MacBook Pro 16"', category: 'Laptops', cost: 220000 },
  { name: 'Lenovo ThinkPad X1 Carbon', category: 'Laptops', cost: 160000 },
  { name: 'Dell Latitude 7440', category: 'Laptops', cost: 110000 },
  { name: 'Dell UltraSharp 27" 4K Monitor', category: 'Monitors', cost: 45000 },
  { name: 'LG 34" Curved Ultrawide Monitor', category: 'Monitors', cost: 55000 },
  { name: 'iPhone 15 Pro 256GB', category: 'Mobile Phones', cost: 130000 },
  { name: 'iPad Pro 11" M2', category: 'Tablets', cost: 85000 },
  { name: 'Conference Room Alpha', category: 'Conference Rooms', cost: 0, shared: true },
  { name: 'Conference Room Beta', category: 'Conference Rooms', cost: 0, shared: true },
  { name: 'Boardroom', category: 'Conference Rooms', cost: 0, shared: true },
  { name: 'Ergonomic Desk Chair', category: 'Furniture', cost: 18000 },
  { name: 'Electric Standing Desk', category: 'Furniture', cost: 35000 }
];

const CONDITIONS = ['New', 'Excellent', 'Good', 'Fair', 'Worn'];
const LOCATIONS = ['HQ Bengaluru - Floor 1', 'HQ Bengaluru - Floor 2', 'HQ Bengaluru - Floor 3', 'HQ Mumbai - Jamnalal Center', 'HQ Delhi - Aerocity'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(): string {
  return `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`;
}

async function main() {
  console.log('🌱 Starting database seed with Indian datasets...');

  // 1. Create Tenant (or get if exists)
  const tenant = await prisma.tenant.upsert({
    where: { domain: 'acme.assetflow.io' },
    update: {},
    create: {
      name: 'Acme India Pvt Ltd',
      domain: 'acme.assetflow.io',
    },
  });
  console.log(`Tenant created/found: ${tenant.name} (${tenant.id})`);

  // Clear existing tenant records
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
  const deptMap: { [key: string]: any } = {};
  for (const d of DEPARTMENTS) {
    const dept = await prisma.department.create({
      data: {
        name: d.name,
        head: d.head,
        tenantId: tenant.id
      }
    });
    deptMap[d.name] = dept;
  }
  console.log('Departments created');

  // 3. Create core demo login accounts
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@assetflow.io',
      name: 'Aarav Sharma',
      role: Role.TENANT_ADMIN,
      tenantId: tenant.id,
      departmentId: deptMap['Engineering'].id,
    },
  });

  const sarahUser = await prisma.user.create({
    data: {
      email: 'sarah@assetflow.io',
      name: 'Sneha Patel',
      role: Role.ASSET_MANAGER,
      tenantId: tenant.id,
      departmentId: deptMap['Engineering'].id,
    },
  });

  const johnUser = await prisma.user.create({
    data: {
      email: 'john@assetflow.io',
      name: 'John Rao',
      role: Role.EMPLOYEE,
      tenantId: tenant.id,
      departmentId: deptMap['Operations'].id,
    },
  });

  // Generate 120 additional Indian employee directory records
  const allUsers = [adminUser, sarahUser, johnUser];
  const emailSet = new Set(['admin@assetflow.io', 'sarah@assetflow.io', 'john@assetflow.io']);

  for (let i = 0; i < 120; i++) {
    const fullName = generateName();
    const email = `${fullName.toLowerCase().replace(/\s+/g, '.')}@acme-india.co.in`;
    
    if (emailSet.has(email)) continue;
    emailSet.add(email);

    const randomDept = getRandomItem(Object.values(deptMap));
    const userRole = Math.random() > 0.85 ? Role.DEPARTMENT_HEAD : Role.EMPLOYEE;

    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        role: userRole,
        tenantId: tenant.id,
        departmentId: randomDept.id,
      }
    });
    allUsers.push(user);
  }
  console.log(`Successfully seeded ${allUsers.length} Indian employee records`);

  // 4. Create Categories
  const categoryNames = ['Laptops', 'Monitors', 'Mobile Phones', 'Tablets', 'Conference Rooms', 'Furniture'];
  const catMap: { [key: string]: any } = {};
  for (const cName of categoryNames) {
    const cat = await prisma.category.create({
      data: {
        name: cName,
        tenantId: tenant.id
      }
    });
    catMap[cName] = cat;
  }
  console.log('Categories created');

  // 5. Seed 180 Assets programmatically
  const seededAssets = [];
  for (let i = 1; i <= 180; i++) {
    const template = getRandomItem(ASSETS_POOL);
    const tag = `AST-${String(i).padStart(3, '0')}`;
    const condition = getRandomItem(CONDITIONS);
    const location = getRandomItem(LOCATIONS);
    const cat = catMap[template.category];

    // Status distribution
    let status: AssetStatus = AssetStatus.AVAILABLE;
    const rng = Math.random();
    if (rng < 0.6) {
      status = AssetStatus.ALLOCATED;
    } else if (rng < 0.75) {
      status = AssetStatus.RESERVED;
    } else if (rng < 0.85) {
      status = AssetStatus.MAINTENANCE;
    } else if (rng < 0.9) {
      status = AssetStatus.LOST;
    }

    // Shared items are always available or reserved, never allocated to one user
    if (template.shared) {
      status = Math.random() > 0.5 ? AssetStatus.AVAILABLE : AssetStatus.RESERVED;
    }

    const asset = await prisma.asset.create({
      data: {
        tag,
        name: template.name,
        serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status,
        location,
        cost: template.cost || null,
        condition,
        acqDate: new Date(Date.now() - Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000)), // up to 2 years ago
        shared: template.shared || false,
        categoryId: cat.id,
        tenantId: tenant.id,
      }
    });
    seededAssets.push(asset);
  }
  console.log(`Seeded ${seededAssets.length} assets`);

  // 6. Create Allocations for allocated assets
  let allocationCount = 0;
  for (const asset of seededAssets) {
    if (asset.status === AssetStatus.ALLOCATED) {
      // Pick a random user that is not the admin
      const user = getRandomItem(allUsers.filter(u => u.role !== Role.TENANT_ADMIN));
      await prisma.allocation.create({
        data: {
          assetId: asset.id,
          userId: user.id,
          tenantId: tenant.id,
          notes: 'Standard operational equipment assignment',
          assignedAt: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000))
        }
      });
      allocationCount++;
    }
  }
  console.log(`Seeded ${allocationCount} allocations`);

  // 7. Seed Resource Bookings for shared conference rooms
  const conferenceRooms = seededAssets.filter(a => a.shared);
  let bookingCount = 0;
  for (let i = 0; i < 35; i++) {
    const room = getRandomItem(conferenceRooms);
    const user = getRandomItem(allUsers);
    
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 7));
    startTime.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1 + Math.floor(Math.random() * 2));

    await prisma.booking.create({
      data: {
        assetId: room.id,
        userId: user.id,
        tenantId: tenant.id,
        startTime,
        endTime,
        status: startTime > new Date() ? 'Upcoming' : 'Completed',
      }
    });
    bookingCount++;
  }
  console.log(`Seeded ${bookingCount} shared room bookings`);

  // 8. Seed Maintenance Tickets
  const maintenanceAssets = seededAssets.filter(a => a.status === AssetStatus.MAINTENANCE);
  const issues = [
    'Keyboard keys unresponsive',
    'Display showing vertical lines',
    'Battery draining extremely fast',
    'Overheating and sudden shutdowns',
    'Wobbly armrest joints',
    'Gas cylinder loose, sinking height',
    'OS crash loop on startup',
    'USB-C charging ports loose'
  ];

  let maintCount = 0;
  for (const asset of maintenanceAssets) {
    const tech = getRandomItem(allUsers.filter(u => u.role === Role.ASSET_MANAGER));
    const stage = getRandomItem(['Pending', 'Approved', 'Technician Assigned', 'In Progress']);
    await prisma.maintenanceTicket.create({
      data: {
        assetId: asset.id,
        issue: getRandomItem(issues),
        priority: getRandomItem(['Low', 'Medium', 'High', 'Critical']),
        stage,
        technicianId: stage !== 'Pending' ? tech.id : null,
        tenantId: tenant.id,
      }
    });
    maintCount++;
  }
  console.log(`Seeded ${maintCount} maintenance tickets`);

  // 9. Seed Notifications
  for (let i = 0; i < 40; i++) {
    const user = getRandomItem(allUsers.filter(u => u.role === Role.TENANT_ADMIN || u.role === Role.ASSET_MANAGER));
    await prisma.notification.create({
      data: {
        userId: user.id,
        text: `Activity alert: Asset update triggered for equipment in ${getRandomItem(LOCATIONS).split(' - ')[0]}`,
        type: getRandomItem(['Alerts', 'Approvals', 'Bookings']),
        read: Math.random() > 0.6,
        tenantId: tenant.id
      }
    });
  }
  console.log('Seeded notifications');

  console.log('🎉 Database seeding successfully completed with over 350+ records!');
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
