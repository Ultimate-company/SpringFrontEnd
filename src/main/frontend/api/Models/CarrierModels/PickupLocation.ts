import {Address} from "Frontend/api/Models/CarrierModels/Address";

export type PickupLocation = {
    pickupLocationId?: number;
    addressNickName: string;
    deleted?: boolean;
    pickupLocationAddressId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
};

export type PickupLocationResponseModel = {
    pickupLocation: PickupLocation;
    address: Address;
};

export type PickupLocationRequestModel = {
    pickupLocation: PickupLocation;
    address: Address;
};