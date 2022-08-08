import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Cable, CableModel} from "./schemas/cable.schema";
import {Model} from "mongoose";
import {CoordinateService} from "../coordinate/coordinate.service";
import {CreateCableDto} from "./dto/create-cable.dto";
import {ICable} from "../interface/interface";
import {CreateCoordinateDto} from "../coordinate/dto/create-coordinate.dto";
import {UpdateCableDto} from "./dto/update-cable.dto";

@Injectable()
export class CableService {
    constructor(
        @InjectModel(Cable.name) private cableModel: Model<CableModel>,
        private coordinateService: CoordinateService,
    ) {}

    // add cable
    async addCable(createCableDto: CreateCableDto): Promise<ICable | any> {
        try{
            const { lat, lng } = createCableDto.coord;
            const createCoordinateDto = new CreateCoordinateDto();
            createCoordinateDto.lat = lat;
            createCoordinateDto.lng = lng;
            const coordinate = await this.coordinateService.createCoordinate(createCoordinateDto);
            const cable = new this.cableModel({
                ...createCableDto,
                coord: coordinate._id,
            });
            return cable.save();
        }catch (error){
            return error;
        }
    }

    // update cable
    async updateCable(id: string, updateCableDto: UpdateCableDto): Promise<ICable | any> {
        try{
            // find the cable and update it
            const cable = await this.cableModel.findById(id);
            if(!cable){
                return {
                    message: 'Cable not found',
                };
            }
            // update the coordinates if they are changed
            if(updateCableDto.coord){
                const { lat, lng } = updateCableDto.coord;
                const createCoordinateDto = new CreateCoordinateDto();
                createCoordinateDto.lat = lat;
                createCoordinateDto.lng = lng;
                const coordinate = await this.coordinateService.createCoordinate(createCoordinateDto);
                cable.coord = coordinate._id;
            }
            // update the rest of the cable
            // if title is changed, update it
            if(updateCableDto.title){
                cable.title = updateCableDto.title;
            }
            // if location is changed, update it
            if(updateCableDto.location){
                cable.location = updateCableDto.location;
            }
            // if details is changed, update it
            if(updateCableDto.details){
                cable.details = updateCableDto.details;
            }
            return cable.save();
        }catch (error){
            return error;
        }
    }

    // get all cables
    async getAllCables(): Promise<ICable[] | any> {
        try{
            // find all the cables and populate the coordinates
            // sort the cables based on the createdAt field
            return await this.cableModel.find().populate('coord').sort({createdAt: -1}).exec();
        }catch (error){
            return error;
        }
    }

    // get cable by id
    async getCableById(id: string): Promise<ICable | any> {
        try{
           // find the cable
            // get the corresponding coordinates
            // const coordinates = await this.coordinateService.getCoordinateById(cable.coord.toString())
            // return {
            //     ...cable.toObject(),
            //     coord: {
            //         lat: coordinates.lat,
            //         lng: coordinates.lat,
            //     }
            // }
            return await this.cableModel.findById(id).populate('coord').exec();
        }catch (error){
            return error;
        }
    }

    // delete cable
    async deleteCable(id: string): Promise<boolean> {
        try{
            // find the cable with id
            const cable = await this.cableModel.findById(id);
            // delete the coordinate
            await this.coordinateService.deleteCoordinate(cable.coord.toString());
            // delete cable
            const _isDeleted = await this.cableModel.findByIdAndDelete(id);
            return !!_isDeleted;
        }catch (error){
            return error;
        }
    }

}
