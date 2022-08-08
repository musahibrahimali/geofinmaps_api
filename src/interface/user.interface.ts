import { Document } from "mongoose";

interface IUser extends Document {
    readonly _id?: string;
    readonly socialId: string;
    readonly username: string;
    readonly password: string;
    readonly fullName: string;
    readonly displayName: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly city: string;
    readonly phoneNumber: string;
    readonly departmentId: string;
    readonly isPermanent: boolean;
    readonly hireDate: string;
    readonly gender: string;
    readonly salt: string;
    readonly passwordResetKey?: string;
    readonly image: string;
    readonly roles: string[];
    readonly isOnline: boolean;
    readonly isAdmin: boolean;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IUser;
