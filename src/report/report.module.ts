import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Report, ReportSchema} from "./schemas/report.schema";
import {CoordinateModule} from "../coordinate/coordinate.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Report.name, schema: ReportSchema },
        ]),
        CoordinateModule,
    ],
    providers: [
        ReportService,
    ],
    controllers: [ReportController],
    exports: [ReportService],
})
export class ReportModule {}
