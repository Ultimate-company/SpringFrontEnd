import {PaginationBaseRequestModel} from "Frontend/api/Models/BaseModel";
import {Address} from "Frontend/api/Models/CarrierModels/Address";

export type User = {
    userId?: number;
    loginName?: string;
    password?: string;
    salt?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    datePasswordChanges?: Date;
    loginAttempts?: number;
    role?: string;
    deleted?: boolean;
    locked?: boolean;
    emailConfirmed?: boolean;
    token?: string;
    avatar?: string;
    dob?: Date;
    guest?: boolean;
    lockedAttempts?: number;
    apiKey?: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type Permissions = {
    permissionId?: number;
    userPermissions: string;
    userLogPermissions: string;
    groupsPermissions: string;
    messagesPermissions: string;
    promosPermissions: string;
    addressPermissions: string;
    pickupLocationPermissions: string;
    ordersPermissions: string;
    paymentsPermissions: string;
    eventsPermissions: string;
    productsPermissions: string;
    supportPermissions: string;
    apiKeyPermissions: string;
    leadsPermissions: string;
    purchaseOrderPermissions: string;
    salesOrderPermissions: string;
    webTemplatePermissions: string;
    packagePermissions: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type UserLog = {
    logId?: number;
    change?: string;
    oldValue?: string;
    newValue?: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
    userId?: number;
}

export type GetUsersForGridRequestModel = PaginationBaseRequestModel & {
    selectedUsers?: number[];
};

export type GetUserLogsRequestModel = PaginationBaseRequestModel & {
    userId: number;
    carrierId?: number;
};

export type UserResponseModel = {
    user: User;
    address: Address;
    permissions: Permissions;
    groupIds: number[];
}

export type UserRequestModel = {
    user: User;
    address: Address;
    permissions: Permissions;
    userGroupIds: number[];
}