import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Coordinate, CoordinateModel} from "./schemas/coordinate.schema";
import {Model} from "mongoose";
import {CreateCoordinateDto} from "./dto/create-coordinate.dto";
import {CoordinateReponseDto} from "./dto/coordinate-reponse.dto";

@Injectable()
export class CoordinateService {
    constructor(
        @InjectModel(Coordinate.name) private coordinateModel: Model<CoordinateModel>,
    ) {}

    // create coordinate
    async createCoordinate(coordinate: CreateCoordinateDto): Promise<CoordinateReponseDto | any> {
        const newCoordinate = new this.coordinateModel(coordinate);
        return await newCoordinate.save();
    }

    // update coordinate
    async updateCoordinate(id: string, coordinate: CreateCoordinateDto): Promise<CoordinateReponseDto | any> {
        return this.coordinateModel.findByIdAndUpdate(id, coordinate, {new: true});
    }

    // get all coordinates
    async getAllCoordinates(): Promise<CoordinateReponseDto[]>{
        return this.coordinateModel.find();
    }

    // get coordinate by id
    async getCoordinateById(id:string): Promise<CoordinateReponseDto | any>{
        return this.coordinateModel.find({_id: id});
    }

    // delete coordinate
    async deleteCoordinate(id: string): Promise<CoordinateReponseDto | any> {
        return this.coordinateModel.findByIdAndDelete(id);
    }
}
