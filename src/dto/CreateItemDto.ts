import {
  IsString,
  IsDefined,
} from 'class-validator';

export class CreateItemDto {
  constructor(
    name: string,

  ) {
    this.name = name;
  }

  @IsDefined({ message: 'name Empty' })
  @IsString({ message: 'invalid Name' })
  name: string;


}
