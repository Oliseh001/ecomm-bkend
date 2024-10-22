
import { IsInt, IsString } from 'class-validator';

export class CartItemDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  quantity: number;
}

export class CartDto {
  @IsInt()
  id: number;

  items: CartItemDto[];
}