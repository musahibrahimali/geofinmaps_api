import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {CableService} from "./cable.service";
import {CreateCableDto} from "./dto/create-cable.dto";
import {ICable} from "../interface/interface";
import {UpdateCableDto} from "./dto/update-cable.dto";
import {ApiCreatedResponse} from "@nestjs/swagger";
import {CableReponseDto} from "./dto/cable-reponse.dto";
import {JwtAuthGuard} from "../authorization/guards/jwt-auth.guard";
import {boolean} from "joi";

@Controller({ version: '1', path: 'cables' })
export class CableController {
    constructor(private cableService: CableService) {}

    // add cable
    @Post("add")
    @ApiCreatedResponse({type: CableReponseDto, description:"add cable data"})
    @UseGuards(JwtAuthGuard)
    async addCable(@Body() createCableDto: CreateCableDto): Promise<ICable | any> {
        return await this.cableService.addCable(createCableDto);
    }

    // update cable
    @Patch("update/:id")
    @ApiCreatedResponse({type: CableReponseDto, description: "update cable data"})
    @UseGuards(JwtAuthGuard)
    async updateCable(@Param("id") id: string, @Body() updateCableDto: UpdateCableDto): Promise<ICable | any> {
        return await this.cableService.updateCable(id, updateCableDto);
    }

    // get cable by id
    @Get("cable/:id")
    @ApiCreatedResponse({type: CableReponseDto, description: "cable data"})
    @UseGuards(JwtAuthGuard)
    async getCableById(@Param("id") id: string): Promise<ICable | any> {
        return await this.cableService.getCableById(id);
    }

    // get all cables
    @Get("all")
    @ApiCreatedResponse({type: [CableReponseDto], description: "all cable data"})
    @UseGuards(JwtAuthGuard)
    async getAllCables(): Promise<ICable[] | any> {
        return await this.cableService.getAllCables();
    }

    // delete cable
    @Delete("delete/:id")
    @ApiCreatedResponse({type: boolean, description: 'true if cable is deleted'})
    @UseGuards(JwtAuthGuard)
    async deleteCable(@Param("id") id: string): Promise<boolean> {
        return await this.cableService.deleteCable(id);
    }
}
