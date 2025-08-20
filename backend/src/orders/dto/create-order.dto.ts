export class CreateOrderDto {
  userId: number;
  address: string;
  items: { productId: number; quantity: number }[];
}
