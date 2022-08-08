import {Injectable} from '@nestjs/common';
import {CreateAdminDto} from "./dto/create-admin.dto";
import {JwtService} from "@nestjs/jwt";
import {Model} from "mongoose";
import {Admin, AdminModel} from "./schemas/admin.schema";
import {InjectModel} from '@nestjs/mongoose';
import {IAdmin} from "../interface/interface";
import {AdminProfileInfoDto} from "./dto/admin.profile.response.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminModel>,
        private jwtService: JwtService,
    ){}

    // register new admin
    async registerAdmin(createAdminDto: CreateAdminDto): Promise<string> {
        try{
            // set the admin username to email
            createAdminDto.username = createAdminDto.email;
            // split the full name based on spaces
            const fName = createAdminDto.fullName.split(" ");
            // select the first from the fName
            createAdminDto.displayName = fName[0];
            // set teh first name to the first in fName
            createAdminDto.firstName = fName[0];
            // set the last name to the rest in fName
            createAdminDto.lastName = fName.slice(1).join(" ");
            const _admin = await this.createAdmin(createAdminDto);
            if(_admin._id){
                const payload = { username: _admin.username, sub: _admin._id };
                return this.jwtService.sign(payload);
            }
        }catch(error){
            return error;
        }
    }

    // log in admin
    async loginAdmin(user:IAdmin): Promise<string> {
        try{
            const payload = { username: user.username, sub: user._id };
            return this.jwtService.sign(payload);
        }catch(error){
            return error;
        }
    }

    // update Admin profile
    async updateProfile(id: string, updateAdminDto: CreateAdminDto):Promise<AdminProfileInfoDto>{
        return this.updateAdminProfile(id, updateAdminDto);
    }

    // get user profile
    async getProfile(id: string): Promise<AdminProfileInfoDto>{
        const admin = await this.getAdminProfile(id);
        if(admin === undefined) {
            return undefined;
        }
        return admin;
    }

    // update profile picture
    async setNewProfilePicture(id: string, newPicture: string): Promise<string>{
        return await this.updateAdminProfilePicture(id, newPicture);
    }

    // delete profile picture
    async deleteProfilePicture(AdminId:string):Promise<boolean>{
        try{
            const _admin = await this.adminModel.findOne({_id: AdminId})
            // update the profile image
            // const isDeleted = await this.deleteFile(_admin.image);
            _admin.image = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            _admin.save();
            return false;
        }catch(error){
            return false;
        }
    }

    // delete Admin data from database
    async deleteAdminData(id:string): Promise<boolean>{
        // const admin = await this.adminModel.findOne({_id: id});
        // delete all images
        // await this.deleteFile(admin.image);
        // find and delete the Admin
        const _admin = await this.adminModel.findOneAndDelete({_id: id});
        return !!_admin;
    }

    // validate Admin
    async validateAdmin(createAdminDto: CreateAdminDto):Promise<IAdmin>{
        const admin = await this.findOne( createAdminDto.email, createAdminDto.password);
        if(admin === undefined) {
            return undefined;
        }
        return admin;
    }


    /* Private methods */
    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    // find one Admin (user)
    private async findOne(email: string, password:string): Promise<IAdmin | any> {
        try{
            const admin = await this.adminModel.findOne({email: email});
            if(!admin) {
                return undefined;
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if(!isPasswordValid) {
                return null;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(admin.image === defaultImage){
                profileImage = defaultImage;
            }else{
                // profileImage = await Promise.resolve(this.readStream(admin.image));
            }
            return {
                ...admin.toObject(),
                image: profileImage,
                password: "",
                salt: "",
            };
        }catch(error){
            return error;
        }
    }

    // get the profile of a  Admin (user)
    private async getAdminProfile(id: string): Promise<IAdmin | any> {
        try{
            const admin = await this.adminModel.findOne({_id: id});
            if(!admin) {
                return undefined;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(admin.image === defaultImage){
                profileImage = defaultImage;
            }else{
                // profileImage = await Promise.resolve(this.readStream(admin.image));
            }
            return {
                ...admin.toObject(),
                image: profileImage,
                password: "",
                salt: ""
            };
        }catch(error){
            return undefined;
        }
    }

    // create a new admin
    private async createAdmin(createAdminDto: CreateAdminDto): Promise<IAdmin|any> {
        try{
            // check if email already exists
            const emailExists = await this.adminModel.findOne({email: createAdminDto.username});
            if(emailExists){
                return {
                    status: "error",
                    message: "Email already exists"
                }
            }
            const saltRounds = 10;
            // generate salt
            createAdminDto.salt = await bcrypt.genSalt(saltRounds);
            // hash the password
            // add the new password and salt to the dto
            createAdminDto.password = await this.hashPassword(createAdminDto.password, createAdminDto.salt);
            // create a new user
            const createdAdmin = new this.adminModel(createAdminDto);
            return await createdAdmin.save();
        }catch(error){
            return error;
        }
    }

    // update profile picture
    private async updateAdminProfilePicture(id: string, picture: string): Promise<string>{
        try{
            const admin = await this.adminModel.findOne({_id: id});
            if(admin.image === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"){
                // update the Admin image to the new picture
                admin.image = picture;
            }else{
                // delete the old picture from database
                // await this.deleteFile(admin.image);
                // update the Admin image to the new picture
                admin.image = picture;
            }
            // save to database
            const updatedAdmin = await admin.save();
            return updatedAdmin.image;
        }catch(error){
            return error;
        }
    }

    // update profile
    private async updateAdminProfile(id: string, updateAdminDto: CreateAdminDto): Promise<IAdmin | any>{
        try{
            // first find the admin
            const _admin = await this.adminModel.findOne({_id: id});
            // find and update the Admin
            if(updateAdminDto.firstName && updateAdminDto.lastName){
                updateAdminDto.displayName = updateAdminDto.firstName + ' ' + updateAdminDto.lastName;
            }
            if(updateAdminDto.firstName && updateAdminDto.lastName.length < 0){
                updateAdminDto.displayName = updateAdminDto.firstName + ' ' + _admin.lastName;
            }
            if(updateAdminDto.firstName.length < 0 && updateAdminDto.lastName){
                updateAdminDto.displayName = _admin.firstName + ' ' + updateAdminDto.lastName;
            }
            // if password is not '' then update the password as well
            if(updateAdminDto.password.length > 6){
                updateAdminDto.password = await this.hashPassword(updateAdminDto.password, _admin.salt);
            }
            const updatedAdmin = await this.adminModel.findOneAndUpdate({_id: id}, updateAdminDto, {new: true});
            return {
                ...updatedAdmin.toObject(),
                password: "",
                salt: "",
            };
        }catch(error){
            return error;
        }
    }
}
