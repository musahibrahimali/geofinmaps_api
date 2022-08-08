import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import * as Joi from 'joi';
import { config } from "dotenv";
import {UserModule} from "../user/user.module";
import {AdminModule} from "../admin/admin.module";
import {RolesGuard} from "../authorization/authorization";
import {ReportModule} from "../report/report.module";
import {CableModule} from "../cable/cable.module";

// configure dotenv
config();

@Module({
    imports: [
        // configuration module
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
            expandVariables: true,
            // validate stuff with Joi
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().default(5000),
            }),
            validationOptions: {
                // allow unknown keys (false to fail on unknown keys)
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        // connect to mongodb database
        MongooseModule.forRoot(
            process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        ),
        // other modules
        UserModule,
        AdminModule,
        ReportModule,
        CableModule,
    ],
  controllers: [AppController],
  providers: [
      AppService,
      {
          provide: 'APP_GUARD',
          useClass: RolesGuard,
      }
  ],
})
export class AppModule {}
