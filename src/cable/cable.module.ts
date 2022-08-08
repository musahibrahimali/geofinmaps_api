import { Module } from '@nestjs/common';
import { CableService } from './cable.service';
import { CableController } from './cable.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Cable, CableSchema} from "./schemas/cable.schema";
import {CoordinateModule} from "../coordinate/coordinate.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cable.name, schema: CableSchema },
        ]),
        CoordinateModule,
    ],
    providers: [
        CableService,
    ],
    controllers: [CableController],
    exports: [CableService],
})
export class CableModule {}
