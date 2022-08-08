export class AdminProfileInfoDto {
    socialId: string;
    username: string;
    password: string;
    fullName: string;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    phoneNumber: string;
    departmentId: string;
    isPermanent: boolean;
    hireDate: string;
    gender: string;
    salt: string;
    passwordResetKey: string;
    image: string;
    roles: string[];
    isOnline: boolean;
    isAdmin: boolean;
}
