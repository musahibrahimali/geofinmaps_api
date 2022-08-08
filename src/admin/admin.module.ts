import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {PassportModule} from "@nestjs/passport";
import {jwtConstants} from "../constants/constants";
import {JwtModule} from "@nestjs/jwt";
import {MulterModule} from "@nestjs/platform-express";
import {MongooseModule} from "@nestjs/mongoose";
import {AdminSchema, Admin} from "./schemas/admin.schema";
import {JwtStrategy} from "../authorization/authorization";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: {expiresIn: jwtConstants.expiresIn},
        }),
        MulterModule.register({
            dest: './uploads/admin',
        }),
        MongooseModule.forFeature([
            { name: Admin.name, schema: AdminSchema },
        ]),
    ],
    providers: [
        AdminService,
        JwtStrategy,
    ],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
