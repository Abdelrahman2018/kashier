import {
  IsEmail,
  IsString,
  IsDefined,
  Length,
} from 'class-validator';

export class CreateUserDto {
  constructor(
    email: string,

  ) {
    this.email = email;
  }

  @IsDefined({ message: 'emailEmpty' })
  @IsEmail({}, { message: 'invalidEmail' })
  email: string;

}
