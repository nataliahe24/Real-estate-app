export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  identityDocument: number;
  phoneNumber: string;
  birthDate: Date;
  email: string;
  password: string;
  role: Role;
}

export interface Role {
  id: number;
  name: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  identityDocument: number;
  phoneNumber: string;
  birthDate: Date;
  email: string;
  password: string;
} 