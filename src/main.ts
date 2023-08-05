import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //*podemos usar esto o tambien la otra manera (pagination.dto)
      // transform: true,//*estos dos son para que los datos que se envian al servidor sean del mismo tipo que los datos que se reciben del servidor( datos de los dtos, por ejemplo el de la paginacion )
      // transformOptions: {
      //   enableImplicitConversion: true//*si no tendriamos esto y enviamos un numero, lo tomaria como string y no nos aceptaria
      // }
    })
  );

  //*DOCUMENTACION: localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFUL API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    // .addTag('cats')//agrupadores
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${ process.env.PORT }`);
}
bootstrap();
