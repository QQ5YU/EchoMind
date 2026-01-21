export class User {
  id!: string;
  email!: string;
  name?: string;
  passwordHash!: string;
  avatarPath!: string | null;
  avatarUpdatedAt!: Date | null;
  createdAt!: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
