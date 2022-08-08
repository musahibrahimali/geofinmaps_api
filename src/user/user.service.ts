import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserModel} from './schemas/user.schema';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from './dto/create-user.dto';
import {IUser} from '../interface/interface';
import {ProfileInfoDto} from './dto/profile.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserModel>,
        private jwtService: JwtService,
    ){}

    // register user
    async registerUser(createUserDto: CreateUserDto): Promise<string> {
        try {
            // username should be the same as email
            createUserDto.username = createUserDto.email;
            // split the full name based on spaces
            const fName = createUserDto.fullName.split(" ");
            // select the first from the fName
            createUserDto.displayName = fName[0];
            // set teh first name to the first in fName
            createUserDto.firstName = fName[0];
            // set the last name to the rest in fName
            createUserDto.lastName = fName.slice(1).join(" ");
            createUserDto.isOnline = true;
            const _client = await this.createUser(createUserDto);
            if(_client._id){
                const payload = { username: _client.username, sub: _client._id };
                return this.jwtService.sign(payload);
            }
        }catch(error){
            return error;
        }
    }

    // log in user
    async loginUser(user: IUser): Promise<string>{
        try{
            const payload = { username: user.email, sub: user._id };
            const _user = await this.userModel.findOne({_id: user._id});
            if(_user) {
                _user.isOnline = true;
                await _user.save();
            }
            return this.jwtService.sign(payload);
        }catch(error){
            return error;
        }
    }

    // get all users
    async getAllUsers(): Promise<ProfileInfoDto[]> {
        // get all users
        return await this.getAllUserProfiles();
    }

    // update client profile
    async updateProfile(id: string, updateUserDto: CreateUserDto):Promise<ProfileInfoDto>{
        return this.updateUserProfile(id, updateUserDto);
    }

    // get user profile
    async getProfile(id: string): Promise<ProfileInfoDto>{
        const client = await this.getUserProfile(id);
        if(client === undefined) {
            return undefined;
        }
        return client;
    }

    // update profile picture
    async setNewProfilePicture(id: string, newPicture: string): Promise<IUser | any>{
        return await this.updateUserProfilePicture(id, newPicture);
    }

    // delete profile picture
    async deleteProfilePicture(userId:string):Promise<boolean>{
        try{
            const _user = await this.userModel.findOne({_id: userId})
            // update the profile image
            const isDeleted = false // await this.deleteFile(_user.image);
            _user.image = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            _user.save();
            return isDeleted;
        }catch(error){
            return false;
        }
    }

    // delete user data from database
    async deleteUserData(id:string): Promise<boolean>{
        // const user = await this.userModel.findOne({_id: id});
        // delete all images
        // await this.deleteFile(user.image);
        // find and delete the client
        const _user = await this.userModel.findOneAndDelete({_id: id});
        return !!_user;

    }

    // validate user
    async validateUser(createUserDto: CreateUserDto): Promise<IUser>{
        const user = await this.findOne( createUserDto.email, createUserDto.password);
        if(!user) {
            return undefined;
        }
        return user;
    }

    // reset password
    async resetPassword(email: string, password?:string): Promise<boolean> {
        if (password === null) {
            const user = await this.userModel.findOne({ email: email });
            if (!user) {
                return false;
            }
            const key = await this.generateKey();
            // hash the key
            user.passwordResetKey = await this.hashPassword(key, user.salt);
            await user.save();
            // get the user email
            const _user = await this.userModel.findOne({ email: email });
            if (_user) {
                // send email with the key
                const userEmail = _user.email;
                // sent the email
                return await this.sendEmail(userEmail, key);
            }
        } else {
            // password needs to be reset
        }
    }

    // verify reset key
    async verifyResetKey(key: string): Promise<boolean> {
        const user = await this.userModel.findOne({ passwordResetKey: key });
        if (!user) {
            return false;
        }
    }

    // validate google user
    async validateSocialUser(socialId: string, user:CreateUserDto): Promise<IUser | any>{
        const _user = await this.userModel.findOne({socialId: socialId});
        if(_user) {
            return _user;
        }
        return await this.userModel.create(user);
    }

    // sign token for social login
    async signToken(user: IUser): Promise<string> {
        const payload = { username: user.username, sub: user._id };
        return this.jwtService.sign(payload);
    }

    // log out user
    async logoutUser(id): Promise<boolean> {
        const _user = await this.userModel.findOne({_id: id});
        if(_user) {
            _user.isOnline = false;
            await _user.save();
            return true;
        }
        return false;
    }


    /* Private methods */

    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    // generate a 6 digit random number
    private generateRandomNumber(): string {
        const randomNumber = Math.floor(Math.random() * 1000000);
        return randomNumber.toString();
    }

    // generate unique key for user password reset
    private async generateKey(): Promise<string> {
        return this.generateRandomNumber();
    }

    // send email with the key
    private async sendEmail(email: string, key: string): Promise<boolean> {
        console.log(email, key);
        return false;
    }

    // create a new client
    private async createUser(createUserDto: CreateUserDto): Promise<IUser | any> {
        try{
            // check if email already exists
            const emailExists = await this.userModel.findOne({username: createUserDto.username});
            const emailExist_alt = await this.userModel.findOne({email: createUserDto.email});
            if (emailExists || emailExist_alt){
                return {
                    status: "error",
                    message: "Email already exists"
                }
            }
            const saltRounds = 10;
            // generate salt
            createUserDto.salt = await bcrypt.genSalt(saltRounds);
            // hash the password
            // add the new password and salt to the dto
            createUserDto.password = await this.hashPassword(createUserDto.password, createUserDto.salt);
            // create a new user
            const createdClient = new this.userModel(createUserDto);
            return await createdClient.save();
        }catch(error){
            return {
                message: error.message
            }
        }
    }

    // find one client (user)
    private async findOne(email: string, password:string): Promise<ProfileInfoDto | any> {
        try{
            const user = await this.userModel.findOne({username: email});
            if(!user) {
                return undefined;
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return null;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(user.image === defaultImage){
                profileImage = defaultImage;
            }else if(user.socialId.length > 0) {
                profileImage = user.image;
            }else{
                // profileImage = await Promise.resolve(this.readStream(user.image));
            }
            return {
                ...user.toObject(),
                image: profileImage,
                password: "",
                salt: "",
                passwordResetKey: "",
            };
        }catch(err){
            return undefined;
        }
    }

    // get all user profiles
    private async getAllUserProfiles(): Promise<ProfileInfoDto[]> {
        try{
            const users = await this.userModel.find().sort({createdAt: -1});
            return users.map(user => {
                const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                let profileImage: string;
                if(user.image === defaultImage){
                    profileImage = defaultImage;
                }else if(user.socialId.length > 0) {
                    profileImage = user.image;
                }else{
                    // profileImage = await Promise.resolve(this.readStream(user.image));
                }
                return {
                    ...user.toObject(),
                    image: profileImage,
                    password: "",
                    salt: "",
                    passwordResetKey: "",
                };
            }).filter(user => user.isAdmin !== true);
        }catch(err){
            return undefined;
        }
    }

    // get the profile of a  client (user)
    private async getUserProfile(id: string): Promise<ProfileInfoDto> {
        try{
            const user = await this.userModel.findOne({_id: id});
            if(!user) {
                return undefined;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(user.image === defaultImage){
                profileImage = defaultImage;
            }else if(user.socialId.length > 0){
                profileImage = user.image;
            }else{
                // profileImage = await Promise.resolve(this.readStream(user.image));
            }
            return {
                ...user.toObject(),
                image: profileImage,
                password: "",
                salt: "",
                passwordResetKey: "",
            };
        }catch(err){
            return undefined;
        }
    }

    // update profile picture
    private async updateUserProfilePicture(id: string, picture: string): Promise<IUser | any>{
        const user = await this.userModel.findOne({_id: id});
        if(user.image === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"){
            // update the client image to the new picture
            user.image = picture;
        }else{
            // delete the old picture from database
            // await this.deleteFile(user.image);
            // update the client image to the new picture
            user.image = picture;
        }
        // save to database
        const updatedUser = await user.save();
        return {
            ...updatedUser.toObject(),
            password: "",
            salt: "",
        };
    }

    // update profile
    private async updateUserProfile(id: string, updateUserDto: CreateUserDto): Promise<ProfileInfoDto | any>{
        // find and update the client
        const _user = await this.userModel.findOne({_id: id});
        if(_user){
            if(updateUserDto.fullName){
                _user.fullName = updateUserDto.fullName;
                // split the full name based on spaces
                const fName = updateUserDto.fullName.split(" ");
                // select the first from the fName
                updateUserDto.displayName = fName[0];
                // set teh first name to the first in fName
                updateUserDto.firstName = fName[0];
                // set the last name to the rest in fName
                updateUserDto.lastName = fName.slice(1).join(" ");
                _user.firstName = updateUserDto.firstName;
                _user.lastName = updateUserDto.lastName;
            }
            if(updateUserDto.isOnline){
                _user.isOnline = updateUserDto.isOnline;
            }
            _user.save();
            return {
                ..._user.toObject(),
                password: "",
                salt: "",
                passwordResetKey: "",
            };
        }
        return {"message": "no user matching this id"};
    }

}
