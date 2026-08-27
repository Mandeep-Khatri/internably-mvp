import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
    const missing = required.filter((name) => !process.env[name]?.trim());
    if (missing.length) {
      throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
  }

  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
  app.enableCors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Internably API')
    .setDescription('The official Internably mobile/backend API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, doc);

  const port = Number(process.env.PORT || process.env.API_PORT || 4000);
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  console.error('[Internably] API failed to start', error);
  process.exit(1);
});
