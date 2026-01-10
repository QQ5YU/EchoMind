export interface FolderDto {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  createdAt: string | Date;
  children?: FolderDto[];
}

export interface FolderDeleteResponseDto {
  success: boolean;
  message: string;
  data: FolderDto;
}
