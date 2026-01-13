import { z } from "zod";

export const FolderSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
      name: z.string().min(1),
      parentId: z.string().nullable(),
      createdAt: z.string().datetime(),
      children: z.array(FolderSchema).optional(),
    })
    .strict()
    .required()
);

export type FolderDto = z.infer<typeof FolderSchema>;

export const CreateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional(),
});

export type CreateFolderDto = z.infer<typeof CreateFolderSchema>;

export const FolderDeleteResponseSchema = z
  .object({
    success: z.boolean(),
    message: z.string(),
    data: FolderSchema,
  })
  .strict()
  .required();

export type FolderDeleteResponseDto = z.infer<
  typeof FolderDeleteResponseSchema
>;