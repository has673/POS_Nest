import { Body, Controller, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post(':id')
  async checkout(@Param('id') id: number, @Body() body: { amount: number }) {
    const { amount } = body;
    if (isNaN(amount)) {
      throw new Error('Invalid amount provided');
    }
    return this.stripeService.createPaymentIntent(+id, amount);
  }
}
