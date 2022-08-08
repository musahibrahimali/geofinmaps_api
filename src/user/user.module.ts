import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../constants/jwt.constants';
import { User, UserSchema } from './schemas/user.schema';
import { GoogleStrategy, FacebookStrategy } from './strategies/strategies';
import { JwtStrategy } from '../authorization/authorization';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
        MulterModule.register({
            dest: './uploads/users',
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        JwtStrategy,
        GoogleStrategy,
        FacebookStrategy,
    ],
    exports: [UserService]
})
export class UserModule {}
