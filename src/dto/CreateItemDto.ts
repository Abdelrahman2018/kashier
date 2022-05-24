import {
  IsString,
  IsDefined,
} from 'class-validator';

export class CreateItemDto {
  constructor(
    name: string,
    collectionId: string

  ) {
    this.name = name;
    this.collectionId = collectionId;
  }

  @IsDefined({ message: 'name Empty' })
  @IsString({ message: 'invalid Name' })
  name: string;

  @IsDefined({ message: 'collectionId Empty' })
  @IsString({ message: 'invalid collectionId' })
  collectionId: string;

}
