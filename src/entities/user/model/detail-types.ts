import { z } from "zod";

export const userDetailIdentityAccessSchema = z.object({
  code: z.string(),
  isDefault: z.boolean(),
});

export const userDetailAccessSchema = z.object({
  preferredLanguage: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const userDetailPersonalInformationSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  nationality: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const userDetailMetadataSchema = z.object({
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export const userDetailSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  identityAccess: z.array(userDetailIdentityAccessSchema),
  access: userDetailAccessSchema,
  personalInformation: userDetailPersonalInformationSchema,
  metadata: userDetailMetadataSchema,
});

export type UserDetailIdentityAccess = z.infer<typeof userDetailIdentityAccessSchema>;
export type UserDetailAccess = z.infer<typeof userDetailAccessSchema>;
export type UserDetailPersonalInformation = z.infer<typeof userDetailPersonalInformationSchema>;
export type UserDetailMetadata = z.infer<typeof userDetailMetadataSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
