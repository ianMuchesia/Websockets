import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { setupSwagger } from './common/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  // attaches cookies to request object
  app.use(cookieParser());


  //enable cors to more than one domain e.g port 5500 and 3000
  app.enableCors({
    origin: ['http://localhost:5500', 'http://localhost:3000','http://127.0.0.1:5500' ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });



  //swagger
  setupSwagger(app);
  //Global Prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
  });
}
bootstrap();
