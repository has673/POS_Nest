import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventsGateway } from './events/events.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  // const eventGateway = app.get(EventsGateway)
  // setInterval(()=>(eventGateway.sendMessage(),1000))
}
bootstrap();
