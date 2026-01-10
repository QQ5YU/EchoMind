export interface UserDto {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: UserDto;
}
