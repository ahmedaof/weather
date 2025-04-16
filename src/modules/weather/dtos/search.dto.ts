import {IsNotEmpty, IsString} from 'class-validator';

export class SearchDto {
  // city
  @IsNotEmpty({ message: 'city_is_required' })
  city: string;

}
