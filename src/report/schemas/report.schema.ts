import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";
import mongoose from "mongoose";
import {Type} from "class-transformer";
import {User} from "../../user/schemas/user.schema";
import {Coordinate} from "../../coordinate/schemas/coordinate.schema";
import {Cable} from "../../cable/schemas/cable.schema";

export type ReportModel = Report & Document;

@Schema({timestamps: true})
export class Report{
    @IsString()
    @Prop({required: true})
    title: string;

    @IsString()
    @Prop({required: true})
    description: string;

    @Prop({required:true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }]})
    @Type(() => User)
    author: User;

    @IsString()
    @Prop({required: true})
    reportType: string;

    @IsString()
    @Prop({required: true})
    location: string;

    @Prop({required:true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: Coordinate.name }]})
    @Type(() => Coordinate)
    coordinates: Coordinate;

    @Prop({required: true, type: [{type: mongoose.Schema.Types.ObjectId, ref: Cable.name}]})
    @Type(() => Cable)
    cable: Cable;

    // report date
    @Prop({required: true})
    @Type(() => Date)
    reportDate: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
