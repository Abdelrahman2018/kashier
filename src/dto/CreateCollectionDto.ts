import {
  IsString,
  IsDefined,
} from 'class-validator';

export class CreateCollectionDto {
  constructor(
    name: string,
    groupId: string

  ) {
    this.name = name;
    this.groupId = groupId;
  }

  @IsDefined({ message: 'nameEmpty' })
  @IsString({ message: 'invalidName' })
  name: string;

  @IsDefined({ message: 'groupId Empty' })
  @IsString({ message: 'invalid groupId' })
  groupId: string;

}
