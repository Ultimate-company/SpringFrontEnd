export enum GridId {
    USER = 1,
    USER_GROUP = 2,
    PRODUCT = 3,
    PURCHASE_ORDER = 4,
    SALES_ORDER = 5,
    ORDER = 6,
    PACKAGES = 7,
    PAYMENT = 8,
    PROMO = 9,
    PICKUP_LOCATION = 10,
    MESSAGE = 11,
    WEB_TEMPLATE = 12,
    SUPPORT = 13,
    LEAD = 14
}

export type GridPreferenceRequestModel = {
    density?: string;
    visibilityJsonBody?: string;
    rowsPerPage?: number;
    gridId: GridId;
};

export type UserGridPreference = {
    userGridPreferenceId?: number;
    density: string;
    visibilityModel?: string;
    rowsPerPage?: number;
    gridId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    notes?: string;
    auditUserId?: number;
    userId?: number;
};