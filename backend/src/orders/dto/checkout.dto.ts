import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString() @IsNotEmpty()
  addressLine1: string;

  @IsString()
  addressLine2?: string;

  @IsString() @IsNotEmpty()
  city: string;

  @IsString() @IsNotEmpty()
  state: string;

  @IsString() @IsNotEmpty()
  postalCode: string;

  @IsString()
  paymentMethod?: 'COD' | 'CARD';
}
