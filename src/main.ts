import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['error', 'warn', 'debug', 'verbose'],
    });
    const configService = app.get(ConfigService);
    const originUrl = configService.get("ORIGIN_URL")

    // enable cors
    app.enableCors({
        credentials: true,
        origin: originUrl,
        methods: "HEAD, GET,POST,PUT,DELETE,PATCH",
        optionsSuccessStatus: 204,
    });

    // versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // app.setGlobalPrefix('v1');
    app.use(cookieParser());
    app.use(helmet()); // basic security
    app.useGlobalPipes(new ValidationPipe()); // global pipes
    const config = new DocumentBuilder()
        .setTitle("GeoFinMaps API")
        .setDescription("This is the backend api interface for GeoFinMaps")
        .setVersion('0.0.1')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // start up server
    await app.listen(process.env.PORT || 5000).then(() => {
        console.log(`Server running on port http://localhost:${process.env.PORT}`);
        console.log(`Swagger running on port http://localhost:${process.env.PORT}/api`);
        console.log("Press CTRL + C to stop server");
    }).catch((err) => {
        console.log("There was an error starting server. ", err);
    });
}
bootstrap().then(() => console.log());

