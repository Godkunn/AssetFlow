import { z } from 'zod';

// Shared User Schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['SUPER_ADMIN', 'TENANT_ADMIN', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'EMPLOYEE']),
  tenantId: z.string().uuid(),
  departmentId: z.string().uuid().nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;

// Shared Asset Schemas
export const AssetStatusEnum = z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'MAINTENANCE', 'RETIRED', 'LOST']);
export const AssetSchema = z.object({
  id: z.string().uuid(),
  tag: z.string(),
  name: z.string(),
  serialNumber: z.string().nullable().optional(),
  status: AssetStatusEnum,
  location: z.string().nullable().optional(),
  cost: z.number().nullable().optional(),
  condition: z.string().nullable().optional(),
  shared: z.boolean(),
  tenantId: z.string().uuid(),
});
export type Asset = z.infer<typeof AssetSchema>;
