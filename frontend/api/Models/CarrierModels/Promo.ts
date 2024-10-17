export type Promo = {
    promoId?: number;
    description: string;
    deleted?: boolean;
    percent: boolean;
    discountValue: number;
    promoCode: string;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
}