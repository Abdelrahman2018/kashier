import {
  IsString,
  IsDefined,
} from 'class-validator';

export class CreateGroupDto {
  constructor(
    name: string,

  ) {
    this.name = name;
  }

  @IsDefined({ message: 'nameEmpty' })
  @IsString({ message: 'invalidName' })
  name: string;

}
