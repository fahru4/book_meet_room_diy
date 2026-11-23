import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Book Meeting Room API')
    .setDescription(
      'REST API documentation for Meeting Room Booking System',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Rooms', 'Meeting room management')
    .addTag('Bookings', 'Meeting room booking management')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'list',
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Book Meeting Room - API Docs',
  });

  const port = Number(process.env.PORT ?? 8080);

  await app.listen(port, '0.0.0.0');

  console.log(
    `Swagger Documentation: http://localhost:${port}/api-docs`,
  );
}

void bootstrap();