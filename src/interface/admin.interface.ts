import { Document } from "mongoose";

interface IAdmin extends Document{
    readonly _id?: string;
    readonly username: string;
    readonly password: string;
    readonly email?: string;
    readonly fullName: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly displayName?: string;
    readonly salt?: string;
    readonly image?: string | any;
    readonly socialId: string;
    readonly city: string;
    readonly phoneNumber: string;
    readonly departmentId: string;
    readonly isPermanent: boolean;
    readonly hireDate: string;
    readonly gender: string;
    readonly passwordResetKey?: string;
    readonly roles?: string[];
    readonly isAdmin?: boolean;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}

export default IAdmin;