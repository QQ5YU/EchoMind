export class Folder {
  id!: string;
  userId!: string;
  name!: string;
  parentId!: string | null;
  createdAt!: Date;
  children?: Folder[];

  constructor(partial: Partial<Folder>) {
    Object.assign(this, partial);
  }
}
