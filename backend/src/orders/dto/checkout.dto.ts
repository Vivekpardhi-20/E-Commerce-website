import { IsNotEmpty, IsString, Matches } from 'class-validator';

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
  @Matches(/^\d{6}$/, { message: 'Postal code must be exactly 6 digits' })
  postalCode: string;

  @IsString()
  paymentMethod?: 'COD' | 'CARD';
}
