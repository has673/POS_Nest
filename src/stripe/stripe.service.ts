import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(private readonly databaseService: DatabaseService) {
    this.stripe = new Stripe(process.env.Secret_key, {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(id: number, amount: number) {
    try {
      const order = await this.databaseService.order.findUnique({
        where: { id: id },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      console.log(amount, id);
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: 'usd',
        payment_method_types: ['card'],

        metadata: { orderId: order.id.toString() },
      });

      // Save the payment intent ID in the database
      await this.databaseService.order.update({
        where: { id: order.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
          paymentStatus: 'PENDING',
        },
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (err) {
      console.log(err);
    }
  }
}
