import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('API Documentation with Nest')
  .setDescription('API description with nest')
  .setVersion('1.0')
  .addBearerAuth()  // If you're using JWT or other authorization methods
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);

  // const eventGateway = app.get(EventsGateway)
  // setInterval(()=>(eventGateway.sendMessage(),1000))
}
bootstrap();
