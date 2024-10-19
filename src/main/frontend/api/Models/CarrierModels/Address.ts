export type Address = {
    addressId?: number;
    line1: string;
    line2?: string;
    landmark?: string;
    state: string;
    city: string;
    zipCode: string;
    nameOnAddress?: string;
    phoneOnAddress?: string;
    addressLabel?: string;
    emailAtAddress?: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
    userId?: number;
}