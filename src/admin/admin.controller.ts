import {
    Controller,
    Post,
    Body,
    Response,
    UseGuards,
    Patch,
    UseInterceptors,
    Param,
    UploadedFile,
    Request,
    Get,
    Delete
} from '@nestjs/common';
import {ApiCreatedResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "../authorization/authorization";
import {boolean} from "joi";
import {AdminProfileInfoDto} from "./dto/admin.profile.response.dto";
import {CreateAdminDto} from "./dto/create-admin.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {AdminService} from "./admin.service";
import {ConfigService} from "@nestjs/config";

@Controller({ version: '1', path: 'admin' })
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly configService: ConfigService,
    ) {}

    // create a new admin
    @ApiCreatedResponse({type: String, description:"register user"})
    @Post('register')
    async createAdmin(@Body() createAdminDto: CreateAdminDto, @Response({passthrough: true}) response): Promise<{access_token: string}> {
        const domain = this.configService.get("DOMAIN");
        const token = await this.adminService.registerAdmin(createAdminDto);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // login an admin
    @ApiCreatedResponse({type: String, description: "login user id"})
    @Post('login')
    async loginAdmin(@Body() createAdminDto: CreateAdminDto, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const admin = await this.adminService.validateAdmin(createAdminDto);
        const token = await this.adminService.loginAdmin(admin);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // update profile picture
    @ApiCreatedResponse({type: String, description: "update profile picture"})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile-picture/:id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File | any):Promise<string | any>{
        const fileId: string = file.id;
        console.log(file, fileId);
        // return this.adminService.setNewProfilePicture(id, fileId);
    }

    // update profile
    @ApiCreatedResponse({type: AdminProfileInfoDto, description: "update admin profile"})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile/:id')
    async updateAdminProfile(@Param('id') id: string, @Body() updateAdminDto: CreateAdminDto): Promise<AdminProfileInfoDto>{
        return this.adminService.updateProfile(id, updateAdminDto);
    }

    // get the user profile information
    @ApiCreatedResponse({type: AdminProfileInfoDto, description: "admin profile"})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<AdminProfileInfoDto> {
        const {userId} = request.user;
        return this.adminService.getProfile(userId);
    }

    // get profile by id
    // get the user profile information
    @ApiCreatedResponse({type: AdminProfileInfoDto, description:"admin user profile"})
    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    async getUserProfile(@Param("id") id:string):Promise<AdminProfileInfoDto> {
        return this.adminService.getProfile(id);
    }

    // delete profile picture
    @ApiCreatedResponse({type: boolean, description: "delete profile picture"})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param('id') id: string):Promise<boolean>{
        return this.adminService.deleteProfilePicture(id);
    }

    // log out user
    @ApiCreatedResponse({type: boolean, description: "log out user"})
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logoutAdmin(@Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return true;
    }

    // delete user account
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Delete('delete-admin/:id')
    async deleteAdminData(@Param('id') id: string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return this.adminService.deleteAdminData(id);
    }
}
