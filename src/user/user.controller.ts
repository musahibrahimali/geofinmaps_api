import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Patch,
    Post,
    Request,
    Response,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { boolean } from 'joi';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthGuard, GoogleAuthGuard, JwtAuthGuard } from '../authorization/authorization';

@Controller({ version: '1', path: 'users' })
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){}

    @ApiCreatedResponse({type: String, description: 'User created'})
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto, @Response({passthrough: true}) response): Promise<{access_token: string}>{
        const domain = this.configService.get("DOMAIN");
        const token = await this.userService.registerUser(createUserDto);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    @ApiCreatedResponse({type: String, description: 'log in user'})
    @Post('login')
    async loginUser(@Body() createUserDto: CreateUserDto, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const User = await this.userService.validateUser(createUserDto);
        const token = await this.userService.loginUser(User);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    // reset password
    @ApiCreatedResponse({ type: boolean, description: 'true if password was reset' })
    @Post('reset-password')
    async resetPassword(@Body() updateUserDto: CreateUserDto): Promise<boolean> {
        const password = updateUserDto.password;
        return this.userService.resetPassword(password); // 62c719e7002283bd8bc969cf
    }

    // google authentication
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    // google callback
    @ApiCreatedResponse({type: String})
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Request() request, @Response({passthrough: true}) response):Promise<any>{
        const originUrl = this.configService.get("ORIGIN_URL");
        const token = await this.userService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        // redirect to User page
        response.redirect(`${originUrl}`);
    }

    // facebook auth
    @Get("facebook")
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    // facebook callback
    @ApiCreatedResponse({type: String})
    @Get('facebook/callback')
    async facebookCallback(@Request() request, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const token = await this.userService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        response.redirect('/');
        return {access_token : token};
    }

    // get all users
    @Get('users')
    @ApiCreatedResponse({type: [ProfileInfoDto]})
    async getAllUsers(): Promise<ProfileInfoDto[]> {
        return this.userService.getAllUsers();
    }

    // get profile by id
    @Get('profile/:id')
    @ApiCreatedResponse({type: ProfileInfoDto})
    async getUserProfile(@Param("id") id: string): Promise<ProfileInfoDto>{
        return this.userService.getProfile(id);
    }

    // update profile picture
    @ApiCreatedResponse({type: ProfileInfoDto, description:"Profile picture updated"})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile-picture/:id')
    @UseInterceptors(FileInterceptor('file', {dest: 'uploads/'}))
    async updateProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File | any):Promise<string | any>{
        // const fileId: string = file.id;
        console.log(file);
        // return this.userService.setNewProfilePicture(id, fileId);
    }

    // update profile
    @ApiCreatedResponse({type: ProfileInfoDto, description:"Profile updated"})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile/:id')
    async updateUserProfile(@Param("id") id: string, @Body() updateUserDto: CreateUserDto): Promise<ProfileInfoDto>{
        return this.userService.updateProfile(id, updateUserDto);
    }

    // get the user profile information
    @ApiCreatedResponse({type: ProfileInfoDto, description:"Profile information"})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<ProfileInfoDto> {
        const {userId} = request.user;
        return this.userService.getProfile(userId);
    }

    // delete profile picture
    @ApiCreatedResponse({type: boolean, description:"Profile picture deleted"})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param("id") id: string):Promise<boolean>{
        return this.userService.deleteProfilePicture(id);
    }

    // log out user
    @ApiCreatedResponse({type: boolean, description:"Logged out"})
    @UseGuards(JwtAuthGuard)
    @Get('logout/:id')
    async logoutUser(@Param("id") id:string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return await this.userService.logoutUser(id);
    }

    // delete user account
    @ApiCreatedResponse({type: boolean, description:"User account deleted"})
    @UseGuards(JwtAuthGuard)
    @Delete('delete-user/:id')
    async deleteUserData(@Param("id") id: string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return this.userService.deleteUserData(id);
    }
}
