import {
  IsEmail,
  IsString,
  IsDefined,
} from 'class-validator';

export class CreateUserDto {
  constructor(
    email: string,
    role: string,

  ) {
    this.email = email;
    this.role = role;
  }

  @IsDefined({ message: 'emailEmpty' })
  @IsEmail({}, { message: 'invalidEmail' })
  email: string;

  @IsDefined({ message: 'role Empty' })
  @IsString({ message: 'invalid role' })
  role: string;

}
