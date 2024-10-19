export type Package = {
    packageId?: number;
    deleted?: boolean;
    length: number;
    breadth: number;
    height: number;
    quantity: number;
    pricePerQuantity: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}
